export function getUserTypeName(name){
    switch(name){
        case "ROLE_ADMIN": {
            return "Administrator";
        }
        case "ROLE_USER": {
            return "User";
        }
        default: {
            return "Unknown";
        }
    }
}