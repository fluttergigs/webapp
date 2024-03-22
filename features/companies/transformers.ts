import {CompanySize} from "~/features/companies/company.types";

export function userFacingCompanySize(size: CompanySize) {
    switch (size) {
        case CompanySize.micro:
            return '1-9';
        case CompanySize.small:
            return '10-49';
        case CompanySize.medium:
            return '50-249';
        case CompanySize.large:
            return '250-∞'
    }
}