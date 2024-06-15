export function getStatusName(name){
    switch(name){
        case "STATUS_PENDING": {
            return "Pending";
        }
        case "STATUS_ACCEPTED": {
            return "Accepted";
        }
        case "STATUS_REJECTED": {
            return "Rejected";
        }
        case "STATUS_CANCELLED": {
            return "Cancelled";
        }
        default: {
            return "Unknown";
        }
    }
}