export function getFuelTypeName(name){
    switch(name){
        case "FUEL_GASOLINE": {
            return "Gasoline";
        }
        case "FUEL_HYBRID": {
            return "Hybrid";
        }
        case "FUEL_LPG": {
            return "LPG";
        }
        case "FUEL_DIESEL": {
            return "Diesel";
        }
        case "FUEL_ELECTRIC": {
            return "Electric";
        }
        default: {
            return "Unknown";
        }
    }
}