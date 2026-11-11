package com.techfix.service;

import com.lowagie.text.*;
import com.lowagie.text.Document;
import com.lowagie.text.pdf.*;
import com.techfix.dto.response.DailyRevenueResponseDTO;
import com.techfix.dto.response.CategoryRevenueResponseDTO;
import com.techfix.dto.request.ApprovalRequestDTO;
import com.techfix.dto.request.BudgetAnswerRequestDTO;
import com.techfix.dto.request.BudgetRequestDTO;
import com.techfix.dto.request.MaintenanceRequestDTO;
import com.techfix.dto.request.PaymentRequestDTO;
import com.techfix.dto.response.MaintenanceDetailsResponseDTO;
import com.techfix.dto.response.MaintenanceHistoryResponseDTO;
import com.techfix.dto.response.MaintenanceSummaryResponseDTO;
import com.techfix.events.StatusChangedEvent;
import com.techfix.exception.InvalidMaintenanceApprovalException;
import com.techfix.exception.UpdateInvalidMaintenanceBudgetException;
import com.techfix.model.Category;
import com.techfix.model.MaintenanceRequest;
import com.techfix.model.Payment;
import com.techfix.model.RequestHistory;
import com.techfix.model.User;
import com.techfix.model.enums.Status;
import com.techfix.model.enums.UserRole;
import com.techfix.repository.CategoryRepository;
import com.techfix.repository.MaintenanceRequestRepository;
import com.techfix.repository.PaymentRepository;
import com.techfix.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository requestRepository;
    private final CategoryRepository categoryRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    public MaintenanceRequestService(
            MaintenanceRequestRepository requestRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            PaymentRepository paymentRepository,
            ApplicationEventPublisher eventPublisher
     ) {
        this.requestRepository = requestRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public MaintenanceRequest create(
            MaintenanceRequestDTO request,
            User client
    ) {
        Category category = categoryRepository
                .findByCodeAndActiveTrue(request.categoryCode())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Categoria nao encontrada"
                        )
                );

        MaintenanceRequest maintenanceRequest =
                new MaintenanceRequest();

        maintenanceRequest.setItem(request.item().trim());
        maintenanceRequest.setItemDescription(
                request.itemDescription().trim()
        );
        maintenanceRequest.setItemDefect(
                request.itemDefect().trim()
        );
        maintenanceRequest.setCategory(category);
        maintenanceRequest.setClient(client);
        maintenanceRequest.setStatus(Status.OPEN);

        return requestRepository.save(maintenanceRequest);
    }

    public List<MaintenanceDetailsResponseDTO> getAll(
            String statusCode,
            User user
    ) {
        Status statusEnum = null;

        if (
                statusCode != null
                        && !statusCode.isBlank()
                        && !statusCode.equalsIgnoreCase("ALL")
        ) {
            if (!Status.isValid(statusCode)) {
                throw new EntityNotFoundException(
                        "Nao foi possivel encontrar o codigo "
                                + statusCode
                );
            }

            statusEnum = Status.valueOf(statusCode.toUpperCase());
        }

        List<MaintenanceRequest> requests =
                (user.getRole() == UserRole.employee)
                        ? requestRepository.findAllActive(statusEnum)
                        : requestRepository.findAllActiveByClient(
                                user.getId(),
                                statusEnum
                        );

        return requests.stream()
                .map(m -> new MaintenanceDetailsResponseDTO(m, user))
                .toList();
    }

    public MaintenanceSummaryResponseDTO getMaintenancesSummary() {
        return requestRepository.getMaintenancesSummary();
    }

    public MaintenanceSummaryResponseDTO
    getMaintenancesSummaryByClient(Long clientId) {
        return requestRepository
                .getMaintenancesSummaryByClient(clientId);
    }

    @Transactional(readOnly = true)
    public MaintenanceDetailsResponseDTO findById(
            String id,
            User user
    ) {
        Long maintenanceId = Long.parseLong(id);

        if (user.getRole() == UserRole.employee) {
            return requestRepository.findById(maintenanceId)
                    .map(m -> new MaintenanceDetailsResponseDTO(m, user))
                    .orElseThrow(() ->
                            new EntityNotFoundException(
                                    "Solicitacao nao existente"
                            )
                    );
        }

        return requestRepository
                .findByIdAndClientId(maintenanceId, user.getId())
                .map(m -> new MaintenanceDetailsResponseDTO(m, user))
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Solicitacao de servico nao encontrada"
                        )
                );
    }

    @Transactional
    public void approveService(
            ApprovalRequestDTO dto,
            User client
    ) {
        MaintenanceRequest request = requestRepository
                .findByIdAndClientId(
                        dto.id(),
                        client.getId()
                )
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Solicitacao nao encontrada para este cliente"
                        )
                );

        if (request.getStatus() != Status.QUOTED) {
            throw new InvalidMaintenanceApprovalException(
                    "Somente servicos orcados podem ser aprovados"
            );
        }

        request.setStatus(Status.APPROVED);

        requestRepository.save(request);
    }

    @Transactional
    public void setEstimatedBudget(
            BudgetRequestDTO dto,
            User user
    ) {
        MaintenanceRequest request = requestRepository
                .findById(dto.id())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Servico nao encontrado"
                        )
                );

        if (
                !request.getStatus().equals(Status.OPEN)
                        && !request.getStatus().equals(Status.QUOTED)
        ) {
            throw new UpdateInvalidMaintenanceBudgetException(
                    "Nao e possivel alterar o orcamento"
                            + " de uma manutencao invalida."
            );
        }

        Status previousStatus = request.getStatus();

        NumberFormat currencyFormatter =
                NumberFormat.getCurrencyInstance(
                        Locale.of("pt", "BR")
                );

        if (
                request.getEstimatedPrice() != null
                        && request.getStatus() == Status.QUOTED
        ) {
            String previousValue =
                    currencyFormatter.format(
                            request.getEstimatedPrice()
                    );

            String newValue =
                    currencyFormatter.format(dto.value());

            eventPublisher.publishEvent(
                    new StatusChangedEvent(
                            request,
                            previousStatus,
                            Status.QUOTED,
                            user,
                            "ATUALIZAÇÃO DE ORÇAMENTO",
                            "Orçamento de manutenção atualizado de "
                                    + previousValue
                                    + " para "
                                    + newValue
                                    + "."
                    )
            );
        } else {
            String newValue =
                    currencyFormatter.format(dto.value());

            eventPublisher.publishEvent(
                    new StatusChangedEvent(
                            request,
                            previousStatus,
                            Status.QUOTED,
                            user,
                            "ORÇADA",
                            "Orçamento de manutenção realizado no valor de "
                                    + newValue
                                    + "."
                    )
            );
        }

        request.setEstimatedPrice(dto.value());
        request.setStatus(Status.QUOTED);
        request.setResponsibleEmployee(user);

        requestRepository.save(request);
    }

    @Transactional
    public boolean setBudgetAnswer(
            @Valid BudgetAnswerRequestDTO request,
            User user
    ) {
        Optional<MaintenanceRequest> optionalRequest =
                requestRepository.findByIdAndClientId(
                        request.id(),
                        user.getId()
                );

        if (optionalRequest.isEmpty()) {
            return false;
        }

        MaintenanceRequest req = optionalRequest.get();

        if (!req.getStatus().equals(Status.QUOTED)) {
            return false;
        }

        Status previousStatus = req.getStatus();
        String answer = request.answer().toUpperCase();

        if (answer.equals("APPROVED")) {
            req.setStatus(Status.APPROVED);
            req.setPrice(req.getEstimatedPrice());

            eventPublisher.publishEvent(
                    new StatusChangedEvent(
                            req,
                            previousStatus,
                            Status.APPROVED,
                            user,
                            "ORÇAMENTO APROVADO",
                            "Orçamento de manutenção aprovado e inserido no fluxo."
                    )
            );
        } else if (answer.equals("REJECTED")) {
            req.setStatus(Status.REJECTED);

            eventPublisher.publishEvent(
                    new StatusChangedEvent(
                            req,
                            previousStatus,
                            Status.REJECTED,
                            user,
                            "ORÇAMENTO REJEITADO",
                            "Orçamento de manutenção rejeitado e removido do fluxo."
                    )
            );
        } else {
            return false;
        }

        requestRepository.save(req);

        return true;
    }

    @Transactional
    public boolean rescueMaintenance(
            Long id,
            User user
    ) {
        Optional<MaintenanceRequest> optionalRequest =
                requestRepository.findByIdAndClientId(
                        id,
                        user.getId()
                );

        if (optionalRequest.isEmpty()) {
            return false;
        }

        MaintenanceRequest request = optionalRequest.get();

        if (!request.getStatus().equals(Status.REJECTED)) {
            return false;
        }

        Status previousStatus = request.getStatus();

        request.setStatus(Status.APPROVED);
        request.setPrice(request.getEstimatedPrice());

        requestRepository.save(request);

        eventPublisher.publishEvent(
                new StatusChangedEvent(
                        request,
                        previousStatus,
                        Status.APPROVED,
                        user,
                        "SERVIÇO RESGATADO",
                        "Manutenção resgatada de rejeitada para aprovada."
                )
        );

        return true;
    }

    public List<MaintenanceDetailsResponseDTO> searchByStatusAndTerm(
            String statusCode,
            String term,
            User user
    ) {
        Status statusEnum = parseStatus(statusCode);

        Long searchId = null;
        String searchPattern = null;

        if (term != null && !term.isBlank()) {
            term = term.trim();

            if (term.matches("\\d+")) {
                searchId = Long.parseLong(term);
            }

            searchPattern = "%" + term.toLowerCase() + "%";
        }

        List<MaintenanceRequest> requests =
                (user.getRole() == UserRole.employee)
                        ? requestRepository.searchByStatusAndTerm(
                                statusEnum,
                                searchPattern,
                                searchId
                        )
                        : requestRepository.searchByStatusAndTermAndClient(
                                statusEnum,
                                searchPattern,
                                searchId,
                                user.getId()
                        );

        return requests.stream()
                .map(m -> new MaintenanceDetailsResponseDTO(m, user))
                .toList();
    }

    public List<MaintenanceHistoryResponseDTO> getMaintenanceHistory(
            Long id,
            User user
    ) {
        Optional<MaintenanceRequest> maintenance;

        if (user.getRole() == UserRole.client) {
            maintenance = requestRepository
                    .findByIdAndClientId(id, user.getId());
        } else {
            maintenance = requestRepository.findById(id);
        }

        if (maintenance.isEmpty()) {
            throw new EntityNotFoundException(
                    "Manutenção não encontrada!"
            );
        }

        List<RequestHistory> history =
                maintenance.get().getHistory();

        return history.stream()
                .map(MaintenanceHistoryResponseDTO::new)
                .toList();
    }

    private Status parseStatus(String statusCode) {
        if (
                statusCode == null
                        || statusCode.isBlank()
                        || statusCode.equalsIgnoreCase("ALL")
        ) {
            return null;
        }

        if (!Status.isValid(statusCode)) {
            throw new IllegalArgumentException(
                    "Status inválido: " + statusCode
            );
        }

        return Status.valueOf(statusCode.toUpperCase());
    }

    public ResponseEntity<Long> updateMaintenanceResponsibleEmployee(
            Long maintenanceId,
            String employeeEmail,
            User user
    ) {
        Optional<MaintenanceRequest> optionalMaintenance =
                requestRepository.findByIdAndResponsibleEmployeeId(
                        maintenanceId,
                        user.getId()
                );

        if (optionalMaintenance.isEmpty()) {
            throw new EntityNotFoundException(
                    "Manutenção não encontrada"
            );
        }

        MaintenanceRequest request = optionalMaintenance.get();

        if (
                request.getStatus() != Status.APPROVED
                        && request.getStatus() != Status.REDIRECTED
        ) {
            throw new IllegalStateException(
                    "Uma manutenção só pode ser redirecionada após ser aprovada pelo cliente."
            );
        }

        Optional<User> optionalNextEmployee =
                userRepository.findByEmailAndRole(
                        employeeEmail,
                        UserRole.employee
                );

        if (optionalNextEmployee.isEmpty()) {
            throw new EntityNotFoundException(
                    "Funcionário não encontrado"
            );
        }

        User nextEmployee = optionalNextEmployee.get();
        User previousEmployee = request.getResponsibleEmployee();
        Status previousStatus = request.getStatus();

        request.setResponsibleEmployee(nextEmployee);
        request.setStatus(Status.REDIRECTED);

        eventPublisher.publishEvent(
                new StatusChangedEvent(
                        request,
                        previousStatus,
                        Status.REDIRECTED,
                        user,
                        "SERVIÇO REDIRECIONADO",
                        "Manutenção redirecionada do funcionário "
                                + previousEmployee.getName()
                                + " para "
                                + nextEmployee.getName()
                                + "."
                )
        );

        requestRepository.save(request);

        return ResponseEntity.ok(request.getId());
    }

    public ResponseEntity<Long> repairMaintenance(
            Long id,
            User user
    ) {
        Optional<MaintenanceRequest> optionalRequest =
                requestRepository.findByIdAndResponsibleEmployeeId(
                        id,
                        user.getId()
                );

        if (optionalRequest.isEmpty()) {
            throw new EntityNotFoundException(
                    "Manutenção inexistente."
            );
        }

        MaintenanceRequest maintenanceRequest =
                optionalRequest.get();

        Status previousStatus =
                maintenanceRequest.getStatus();

        maintenanceRequest.setStatus(Status.REPAIRED);

        eventPublisher.publishEvent(
                new StatusChangedEvent(
                        maintenanceRequest,
                        previousStatus,
                        Status.REPAIRED,
                        user,
                        "ITEM REPARADO",
                        "Manutenção realizada por: "
                                + user.getName()
                                + ", aguardando pagamento para finalizaçao do serviço."
                )
        );

        requestRepository.save(maintenanceRequest);

        return ResponseEntity.ok(
                maintenanceRequest.getId()
        );
    }

    @Transactional
    public void payMaintenance(
            Long maintenanceId,
            PaymentRequestDTO paymentRequest,
            User client
    ) {
        MaintenanceRequest maintenance =
                requestRepository.findByIdAndClientId(
                        maintenanceId,
                        client.getId()
                )
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Manutenção não encontrada para este cliente."
                        )
                );

        if (maintenance.getStatus() != Status.REPAIRED) {
            throw new IllegalArgumentException(
                    "Somente serviços arrumados podem ser pagos."
            );
        }

        if (maintenance.getPayment() != null) {
            throw new IllegalArgumentException(
                    "Esta manutenção já possui um pagamento."
            );
        }

        if (maintenance.getPrice() == null) {
            throw new IllegalArgumentException(
                    "A manutenção não possui um valor final."
            );
        }

        Payment payment = new Payment();
        payment.setPaymentMethod(
                paymentRequest.paymentMethod()
        );
        payment.setAmount(
                maintenance.getPrice()
        );

        paymentRepository.save(payment);

        Status previousStatus =
                maintenance.getStatus();

        maintenance.setPayment(payment);
        maintenance.setStatus(Status.PAID);

        NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(Locale.of("pt", "BR"));
        String maintenancePrice = currencyFormatter.format(maintenance.getPrice());

        eventPublisher.publishEvent(
                new StatusChangedEvent(
                        maintenance,
                        previousStatus,
                        Status.PAID,
                        client,
                        "PAGAMENTO REALIZADO",
                        "Pagamento realizado pelo cliente no valor de "
                                + maintenancePrice
                )
        );

        requestRepository.save(maintenance);
    }

    public void finishMaintenance(Long id, User user) {
        Optional<MaintenanceRequest> request = requestRepository.findByIdAndResponsibleEmployeeId(id, user.getId());

        if (!request.isPresent()) {
            throw new EntityNotFoundException("Serviço de manutenção não encontrado.");
        }

        MaintenanceRequest maintenance = request.get();

        Status previousStatus = maintenance.getStatus();
        maintenance.setStatus(Status.FINISHED);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", Locale.of("pt", "BR"));
        String formattedDate = LocalDate.now().format(formatter);
        eventPublisher.publishEvent(
                new StatusChangedEvent(
                        maintenance,
                        previousStatus,
                        Status.FINISHED,
                        user,
                        "FINALIZAÇÃO DE SERVIÇO",
                        "Serviço finalizado em " + formattedDate + ", por " + user.getName()
                )
        );
    }

    public byte[] generateRevenueReport(
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<DailyRevenueResponseDTO> revenues =
                requestRepository.findRevenuesByPeriod(
                        startDate,
                        endDate
                );

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    18
            );

            Paragraph title = new Paragraph(
                    "Relatório de Receitas",
                    titleFont
            );

            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);

            Font headerFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    11
            );

            table.addCell(new PdfPCell(
                    new Phrase("Data", headerFont)
            ));

            table.addCell(new PdfPCell(
                    new Phrase("Receita (R$)", headerFont)
            ));

            BigDecimal grandTotal = BigDecimal.ZERO;

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern("dd/MM/yyyy");

            NumberFormat currencyFormatter =
                    NumberFormat.getCurrencyInstance(
                            Locale.of("pt", "BR")
                    );

            for (DailyRevenueResponseDTO revenue : revenues) {
                table.addCell(
                        revenue.date().format(formatter)
                );

                table.addCell(
                        currencyFormatter.format(
                                revenue.totalRevenue()
                        )
                );

                grandTotal = grandTotal.add(
                        revenue.totalRevenue()
                );
            }

            if (revenues.isEmpty()) {
                PdfPCell emptyCell = new PdfPCell(
                        new Phrase(
                                "Nenhuma receita encontrada no período."
                        )
                );

                emptyCell.setColspan(2);
                table.addCell(emptyCell);
            }

            document.add(table);

            Paragraph total = new Paragraph(
                    "\nTotal no período: "
                            + currencyFormatter.format(grandTotal),
                    titleFont
            );

            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            document.close();

            return out.toByteArray();

        } catch (Exception exception) {
            throw new RuntimeException(
                    "Erro ao gerar relatório de receitas",
                    exception
            );
        }
    }

    // Remove os parâmetros LocalDate daqui
    public byte[] generateCategoryRevenueReport() {

        // Passa null diretamente para garantir que busque "desde sempre"
        List<CategoryRevenueResponseDTO> revenues =
                requestRepository.findCategoryRevenuesByPeriod(null, null);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);

            Paragraph title = new Paragraph("Relatório de Receitas por Categoria", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(10);
            document.add(title);

            // Substitui toda aquela lógica de IF/ELSE das datas por um texto fixo
            Paragraph period = new Paragraph("Período: Desde sempre (Todo o histórico)");
            period.setAlignment(Element.ALIGN_CENTER);
            period.setSpacingAfter(20);
            document.add(period);

            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{2.0f, 4.0f, 2.5f});

            table.addCell(new PdfPCell(new Phrase("Código", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Categoria", headerFont)));
            table.addCell(new PdfPCell(new Phrase("Receita", headerFont)));

            NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(Locale.of("pt", "BR"));
            BigDecimal grandTotal = BigDecimal.ZERO;

            for (CategoryRevenueResponseDTO revenue : revenues) {
                table.addCell(revenue.categoryCode());
                table.addCell(revenue.categoryName());
                table.addCell(currencyFormatter.format(revenue.totalRevenue()));
                grandTotal = grandTotal.add(revenue.totalRevenue());
            }

            if (revenues.isEmpty()) {
                PdfPCell emptyCell = new PdfPCell(new Phrase("Nenhuma receita encontrada no período."));
                emptyCell.setColspan(3);
                table.addCell(emptyCell);
            }

            document.add(table);

            Paragraph total = new Paragraph(
                    "\nTotal geral: " + currencyFormatter.format(grandTotal),
                    titleFont
            );
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);

            document.close();
            return out.toByteArray();

        } catch (Exception exception) {
            throw new RuntimeException("Erro ao gerar relatório de receitas por categoria", exception);
        }
    }
}
