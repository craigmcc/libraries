// application-validators ----------------------------------------------------

// Application-specific validators that can be used in both client and server
// environments.  In all cases, a "true" return indicates that the proposed
// value is valid, while "false" means it is not.  If a field is required, that
// must be validated separately.

// Public Objects -----------------------------------------------------------

export const validateLocation = (location: string | null | undefined): boolean => {
    if (!location) {
        return true;
    } else {
        return VALID_LOCATIONS.has(location);
    }
}

export const VALID_LOCATIONS: Map<string, string> = new Map();
VALID_LOCATIONS.set("Box",          "Book in a Box (see Notes)");
VALID_LOCATIONS.set("Computer",     "Computer Downloads (PDF)");
VALID_LOCATIONS.set("Kindle",       "Kindle Download (Purchased)");
VALID_LOCATIONS.set("Kobo",         "Kobo Download (Purchased)");
VALID_LOCATIONS.set("Other",        "Other Location (see Notes)");
VALID_LOCATIONS.set("Returned",     "Kindle Unlimited (Returned)");
VALID_LOCATIONS.set("Unlimited",    "Kindle Unlimited (Checked Out)");
VALID_LOCATIONS.set("Watch",        "Not Yet Purchased or Downloaded");

export const validateVolumeType = (type: string | null | undefined): boolean => {
    if (!type) {
        return true;
    } else {
        return VALID_VOLUME_TYPES.has(type);
    }
}

export const VALID_VOLUME_TYPES: Map<string, string> = new Map();
VALID_VOLUME_TYPES.set("Single",        "Single Story by Volume Author(s)");
VALID_VOLUME_TYPES.set("Collection",    "Collection by Volume Authors(s)");
VALID_VOLUME_TYPES.set("Anthology",     "Anthology by different Author(s)");
