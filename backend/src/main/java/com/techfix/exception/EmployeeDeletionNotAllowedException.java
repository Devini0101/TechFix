package com.techfix.exception;

// funcionário não pode ser excluído (tem manutenções/histórico ligados a ele, ou é o próprio usuário logado)
public class EmployeeDeletionNotAllowedException extends RuntimeException {
    public EmployeeDeletionNotAllowedException(String message) {
        super(message);
    }
}
