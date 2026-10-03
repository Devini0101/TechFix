package com.techfix.listener;

import com.techfix.events.StatusChangedEvent;
import com.techfix.model.RequestHistory;
import com.techfix.repository.RequestHistoryRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class StatusHistoryListener {

    private final RequestHistoryRepository historyRepository;

    public StatusHistoryListener(RequestHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @TransactionalEventListener
    public void handleStatusChange(StatusChangedEvent event) {
        RequestHistory history = new RequestHistory();
        history.setMaintenanceRequest(event.maintenanceRequest());
        history.setPreviousStatus(event.previousStatus());
        history.setNewStatus(event.newStatus());
        history.setEmployee(event.responsibleEmployee());
        history.setAction(event.action());
        history.setDescription(event.description());

        historyRepository.save(history);
    }

}
