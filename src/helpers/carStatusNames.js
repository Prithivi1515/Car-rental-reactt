export function getCarStatusName(name){
    switch(name){
        case true: {
            return "Yes";
        }
        case false: {
            return "No";
        }
        default: {
            return "Unknown";
        }
    }
}