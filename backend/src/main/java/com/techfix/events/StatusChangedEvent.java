package com.techfix.events;

import com.techfix.model.MaintenanceRequest;
import com.techfix.model.User;
import com.techfix.model.enums.Status;

public record StatusChangedEvent(
        MaintenanceRequest maintenanceRequest,
        Status previousStatus,
        Status newStatus,
        User responsibleEmployee,
        String action,
        String description
) {
}
