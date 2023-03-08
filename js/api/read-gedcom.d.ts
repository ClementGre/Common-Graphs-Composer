declare module "tree/TreeIndex" {
    /**
     * The index for a node.
     */
    export interface TreeIndex {
        /**
         * Find all children indices for a given tag.
         * This also includes children having a pointer.
         */
        byTag: {
            [tag: string]: number[];
        };
    }
}
declare module "tree/TreeNode" {
    import { TreeIndex } from "tree/TreeIndex";
    /**
     * A node in a Gedcom file.
     */
    export interface TreeNode {
        /**
         * The Gedcom tag of this node. Usually in uppercase, possibly starting with an underscore.
         * The root is the only node for which the tag is <code>null</code>.
         */
        tag: string | null;
        /**
         * An optional pointer, used to reference this node elsewhere. Starts and ends with the <code>@</code> symbol and contains an uppercase identifier.
         */
        pointer: string | null;
        /**
         * An optional string value. Can be any string.
         */
        value: string | null;
        /**
         * Absolute node index in source file, namely the line number minus one.
         * The <code>CONT</code> and <code>CONC</code> pseudo-tags are included in the count, hence possibly introducing gaps in the indices.
         */
        indexSource: number;
        /**
         * Node index in the output tree, relative to the parent.
         */
        indexRelative: number;
        /**
         * This node's children nodes.
         */
        children: TreeNode[];
        /**
         * The index for this node, if computed.
         * It can be safely serialized as it does not contain any reference, but rather indices (represented as integers).
         */
        _index?: TreeIndex;
    }
}
declare module "tree/TreeIndexRoot" {
    import { TreeIndex } from "tree/TreeIndex";
    /**
     * The index for the root node.
     */
    export interface TreeIndexRoot extends TreeIndex {
        /**
         * Find all children indices that have a pointer, by their tag.
         */
        byTagPointer: {
            [tag: string]: {
                [pointer: string]: number;
            };
        };
        /**
         * Find all children indices of family records for a given individual pointer where the record is a spouse in that family.
         */
        asSpouse?: {
            [spouseId: string]: number[];
        };
        /**
         * Find all children indices of family records for a given individual pointer where the record is a child in that family.
         */
        asChild?: {
            [childId: string]: number[];
        };
    }
}
declare module "tree/TreeNodeRoot" {
    import { TreeNode } from "tree/TreeNode";
    import { TreeIndexRoot } from "tree/TreeIndexRoot";
    /**
     * The (virtual) root node of a Gedcom file.
     */
    export interface TreeNodeRoot extends TreeNode {
        tag: null;
        pointer: null;
        value: null;
        indexSource: -1;
        indexRelative: 0;
        _index?: TreeIndexRoot;
    }
}
declare module "tree/utils" {
    import { TreeNode } from "tree/TreeNode";
    /**
     * Create a Gedcom-like string representation of this Gedcom node.
     * @param node The Gedcom node
     */
    export const nodeToString: (node: TreeNode) => string;
}
declare module "tree/index" {
    /**
     * @module Tree
     */
    export { TreeIndex } from "tree/TreeIndex";
    export { TreeNode } from "tree/TreeNode";
    export { TreeNodeRoot } from "tree/TreeNodeRoot";
    export { TreeIndexRoot } from "tree/TreeIndexRoot";
    export * from "tree/utils";
}
declare module "parse/value/ValueExactDate" {
    export interface ValueExactDate {
        day: number;
        month: number;
        year: number;
    }
}
declare module "parse/value/ValueExactTime" {
    export interface ValueExactTime {
        hours: number;
        minutes: number;
        seconds?: number;
        centiseconds?: number;
    }
}
declare module "parse/value/ValueNameParts" {
    export type ValueNameParts = (string | undefined)[] & [string | undefined, string | undefined, string | undefined] & ([string, string, string] | [undefined, string, string] | [string, string, undefined] | [undefined, string, undefined] | [string, undefined, undefined]);
}
declare module "parse/value/ValueAge" {
    export interface ValueAge {
        isGreaterThan: boolean;
        isLessThan: boolean;
        hasDate: boolean;
        date?: {
            years: number;
            months: number;
            days: number;
        };
        isChild: boolean;
        isInfant: boolean;
        isStillborn: boolean;
    }
}
declare module "parse/value/age" {
    import { ValueAge } from "parse/value/ValueAge";
    /**
     * Parses an age value.
     * @param value The value to parse
     * @category Value parsers
     */
    export const parseAge: (value: string | null) => ValueAge | null;
}
declare module "parse/value/dates" {
    export interface ValuePartYearBase {
        value: number;
        isBce: boolean;
        isDual: boolean;
    }
    export interface ValuePartYearNormal extends ValuePartYearBase {
        isDual: false;
    }
    export interface ValuePartYearDual extends ValuePartYearBase {
        isDual: true;
        valueDual: number;
    }
    /**
     * Stores information about the year.
     * Note that the field {@link value} is always a positive integer; if the date is
     * BCE then it is indicated by {@link isBce}. The year can also be "dual": although uncommon
     * in practice, this means that there is an ambiguity between two years. In that case the second
     * year is expressed as a two-digit number and stored in {@link valueDual}.
     */
    export type ValuePartYear = ValuePartYearNormal | ValuePartYearDual;
    export interface ValuePartCalendar {
        isGregorian: boolean;
        isJulian: boolean;
        isHebrew: boolean;
        isFrenchRepublican: boolean;
        isUnknown: boolean;
    }
    export interface ValuePartDateYear {
        calendar: ValuePartCalendar;
        year: ValuePartYear;
    }
    export interface ValuePartDateMonth extends ValuePartDateYear {
        month: number;
    }
    export interface ValuePartDateDay extends ValuePartDateMonth {
        day: number;
    }
    /**
     * Represents a known date or partially known date expressed in a certain calendar.
     * It is guaranteed that the fields {@link calendar} and {@link year} are defined.
     * Note that the year is not a value but an object, because it contains more information (see {@link ValuePartYear}).
     * If defined, both the month and the day start at value 1.
     */
    export type ValuePartDate = ValuePartDateYear | ValuePartDateMonth | ValuePartDateDay;
    /**
     * The base type for all date values.
     */
    export interface ValueDateBase {
        /**
         * Indicates an instance of {@link ValueDateDated}.
         */
        hasDate: boolean;
        /**
         * Indicates an instance of {@link ValueDatePhrased}.
         */
        hasPhrase: boolean;
        /**
         * Indicates an instance of {@link ValueDatePunctual}. Implies {@link hasDate}.
         */
        isDatePunctual: boolean;
        /**
         * Indicates an instance of {@link ValueDatePeriod}. Implies {@link hasDate}.
         */
        isDatePeriod: boolean;
        /**
         * Indicates an instance of {@link ValueDateRange}. Implies {@link hasDate}.
         */
        isDateRange: boolean;
        /**
         * Indicates an instance of {@link ValueDateApproximated}. Implies {@link hasDate}.
         */
        isDateApproximated: boolean;
        /**
         * Indicates an instance of {@link ValueDateInterpreted}. Implies {@link hasDate}.
         */
        isDateInterpreted: boolean;
    }
    /**
     * An instance is indicated by {@link hasPhrase}.
     */
    export interface ValueDatePhrased extends ValueDateBase {
        hasPhrase: true;
        phrase: string;
        isDatePeriod: false;
        isDateRange: false;
        isDateApproximated: false;
    }
    /**
     * An instance is indicated by the conjunction of {@link hasPhrase} and negated {@link hasDate} (or equivalently, {@link hasPhrase} and negated {@link isDateInterpreted}).
     */
    export interface ValueDatePhraseOnly extends ValueDatePhrased {
        hasDate: false;
        isDatePunctual: false;
        isDateApproximated: false;
        isDateInterpreted: false;
    }
    /**
     * An instance is indicated by {@link hasDate}.
     */
    export interface ValueDateDated extends ValueDateBase {
        hasDate: true;
    }
    /**
     * An instance is indicated by {@link isDatePunctual}.
     */
    export interface ValueDatePunctual extends ValueDateDated {
        isDatePunctual: true;
        date: ValuePartDate;
        isDatePeriod: false;
        isDateRange: false;
    }
    /**
     * An instance is indicated by {@link isDateApproximated}.
     */
    export interface ValueDateApproximated extends ValueDatePunctual {
        isDateApproximated: true;
        approximationKind: {
            isAbout: boolean;
            isCalculated: boolean;
            isEstimated: boolean;
        };
        hasPhrase: false;
        isDateInterpreted: false;
    }
    /**
     * An instance is indicated by {@link isDateInterpreted} (or equivalently by the conjunction of {@link isDatePunctual} and {@link hasPhrase}).
     */
    export interface ValueDateInterpreted extends ValueDatePunctual, ValueDatePhrased {
        hasDate: true;
        isDatePunctual: true;
        hasPhrase: true;
        isDateInterpreted: true;
        isDateApproximated: false;
    }
    /**
     * An instance is indicated by the conjunction of {@link isDatePunctual}, negated {@link isDateApproximated} and negated {@link isDateInterpreted}.
     */
    export interface ValueDateNormal extends ValueDatePunctual {
        hasPhrase: false;
        isDateApproximated: false;
        isDateInterpreted: false;
    }
    /**
     * An instance is indicated by {@link isDateRange}.
     */
    export interface ValueDateRange extends ValueDateDated {
        isDateRange: true;
        hasPhrase: false;
        isDatePunctual: false;
        isDatePeriod: false;
        isDateApproximated: false;
        isDateInterpreted: false;
    }
    /**
     * An instance is indicated by {@link isDateRange} and defined {@link dateAfter}.
     */
    export interface ValueDateRangeAfter extends ValueDateRange {
        dateAfter: ValuePartDate;
    }
    /**
     * An instance is indicated by {@link isDateRange} and defined {@link dateBefore}.
     */
    export interface ValueDateRangeBefore extends ValueDateRange {
        dateBefore: ValuePartDate;
    }
    /**
     * An instance is indicated by {@link isDateRange}, defined {@link dateAfter} and defined {@link dateBefore}.
     */
    export interface ValueDateRangeFull extends ValueDateRangeAfter, ValueDateRangeBefore {
    }
    /**
     * An instance is indicated by {@link isDatePeriod}.
     */
    export interface ValueDatePeriod extends ValueDateDated {
        isDatePeriod: true;
        hasPhrase: false;
        isDatePunctual: false;
        isDateRange: false;
        isDateApproximated: false;
        isDateInterpreted: false;
    }
    /**
     * An instance is indicated by {@link isDatePeriod} and defined {@link dateFrom}.
     */
    export interface ValueDatePeriodFrom extends ValueDatePeriod {
        dateFrom: ValuePartDate;
    }
    /**
     * An instance is indicated by {@link isDatePeriod} and defined {@link dateTo}.
     */
    export interface ValueDatePeriodTo extends ValueDatePeriod {
        dateTo: ValuePartDate;
    }
    /**
     * An instance is indicated by {@link isDatePeriod}, defined {@link dateFrom} and defined {@link dateTo}.
     */
    export interface ValueDatePeriodFull extends ValueDatePeriodFrom, ValueDatePeriodTo {
    }
    /**
     * A valid Gedcom date. See {@link ValueDateBase}, the base type for all of them.
     */
    export type ValueDate = ValueDateNormal | ValueDateApproximated | ValueDatePeriodFrom | ValueDatePeriodTo | ValueDatePeriodFull | ValueDateRangeAfter | ValueDateRangeBefore | ValueDateRangeFull | ValueDateInterpreted | ValueDatePhraseOnly;
}
declare module "parse/value/date" {
    import { ValueDate } from "parse/value/dates";
    import { ValueExactDate } from "parse/value/ValueExactDate";
    /**
     * Parses a Gedcom date. These dates can take many different forms, see {@link ValueDate}.
     * The dates are checked for validity with respect to their calendar, except for the Hebrew calendar which will assume all dates to be valid due to a missing implementation.
     * Any unsuccessful parsing or invalid date(s) will result in <code>null</code>.
     * @param value The value to parse
     * @category Value parsers
     */
    export const parseDate: (value: string | null) => ValueDate | null;
    /**
     * Parses a date of format day-month-year.
     * @param value The value to parse
     * @category Value parsers
     */
    export const parseExactDate: (value: string | null) => ValueExactDate | null;
}
declare module "parse/value/datejs" {
    import { ValuePartDate } from "parse/value/dates";
    import { ValueExactDate } from "parse/value/ValueExactDate";
    import { ValueExactTime } from "parse/value/ValueExactTime";
    /**
     * Converts a parsed Gedcom date to its corresponding JS date (expressed in the Gregorian calendar).
     * The supported calendars are: Gregorian, Julian and French Republican.
     * The Hebrew calendar is not yet supported. Unknown calendars are inherently unsupported.
     * Dual dates will not be converted. BCE dates will be converted assuming the existence of year 0.
     * In any of these cases the returned value will be <code>null</code>.
     * The argument is assumed to be correct, that is of correct format and valid date.
     * This is already guaranteed by {@link parseDate}.
     * @param date The parsed date to convert
     * @category Parsed value converters
     */
    export const toJsDate: (date: ValuePartDate) => Date | null;
    /**
     * Converts a parsed Gedcom date and optional time into the corresponding JS datetime.
     * @param date The parsed date
     * @param time And optional parsed time
     * @category Parsed value converters
     */
    export const toJsDateTime: (date: ValueExactDate, time?: ValueExactTime) => Date | null;
}
declare module "parse/value/coordinates" {
    /**
     * @param value
     * @category Value parsers
     */
    export const parseLatitude: (value: string | null) => number | null;
    /**
     * @param value
     * @category Value parsers
     */
    export const parseLongitude: (value: string | null) => number | null;
}
declare module "parse/value/exacttime" {
    import { ValueExactTime } from "parse/value/ValueExactTime";
    /**
     * Parses a time of format hours-minutes, optionally containing seconds and even centiseconds information.
     * @param value The value to parse
     * @category Value parsers
     */
    export const parseExactTime: (value: string | null) => ValueExactTime | null;
}
declare module "parse/value/place" {
    /**
     * Parses a place value into parts.
     * It essentially performs a split on the comma character.
     * @param value The value to parse
     * @category Value parsers
     */
    export const parsePlaceParts: (value: string | null) => string[] | null;
}
declare module "parse/value/name" {
    import { ValueNameParts } from "parse/value/ValueNameParts";
    /**
     * Parses a name value into three potentially undefined name parts.
     * @param value The value to parse
     * @category Value parsers
     */
    export const parseNameParts: (value: string | null) => ValueNameParts | null;
}
declare module "parse/value/version" {
    /**
     * Parses a version value into version number parts.
     * @param value The value to parse
     * @category Value parsers
     */
    export const parseVersionParts: (value: string | null) => (number[] & ([number, number] | [number, number, number])) | null;
}
declare module "parse/value/index" {
    /**
     * @category Parsed values
     */
    export { ValueExactDate } from "parse/value/ValueExactDate";
    /**
     * @category Parsed values
     */
    export { ValueExactTime } from "parse/value/ValueExactTime";
    /**
     * @category Parsed values
     */
    export { ValueNameParts } from "parse/value/ValueNameParts";
    /**
     * @category Parsed values
     */
    export { ValueAge } from "parse/value/ValueAge";
    export { parseAge } from "parse/value/age";
    /**
     * @category Parsed values
     */
    export { ValuePartYear, ValuePartYearNormal, ValuePartYearDual, ValuePartCalendar, ValuePartDateYear, ValuePartDateMonth, ValuePartDateDay, ValuePartDate, ValueDateBase, ValueDatePhrased, ValueDatePhraseOnly, ValueDateDated, ValueDatePunctual, ValueDateApproximated, ValueDateInterpreted, ValueDateNormal, ValueDateRange, ValueDateRangeAfter, ValueDateRangeBefore, ValueDateRangeFull, ValueDatePeriod, ValueDatePeriodFrom, ValueDatePeriodTo, ValueDatePeriodFull, ValueDate, } from "parse/value/dates";
    export { parseDate, parseExactDate } from "parse/value/date";
    export { toJsDate, toJsDateTime } from "parse/value/datejs";
    export { parseLatitude, parseLongitude } from "parse/value/coordinates";
    export { parseExactTime } from "parse/value/exacttime";
    export { parsePlaceParts } from "parse/value/place";
    export { parseNameParts } from "parse/value/name";
    export { parseVersionParts } from "parse/value/version";
}
declare module "tag/Tag" {
    /**
     * All the standard Gedcom tags.
     */
    export const enum Tag {
        Abbreviation = "ABBR",
        Address = "ADDR",
        Address1 = "ADR1",
        Address2 = "ADR2",
        Address3 = "ADR3",
        Adoption = "ADOP",
        AdultChristening = "CHRA",
        Age = "AGE",
        Agency = "AGNC",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        Alias = "ALIA",
        Ancestors = "ANCE",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        AncestorInterest = "ANCI",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        AncestralFileNumber = "AFN",
        Annulment = "ANUL",
        Associates = "ASSO",
        Author = "AUTH",
        Baptism = "BAPM",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        BaptismLDS = "BAPL",
        BarMitzvah = "BARM",
        BatMitzvah = "BASM",
        BinaryObject = "BLOB",
        Birth = "BIRT",
        Blessing = "BLES",
        Burial = "BURI",
        CallNumber = "CALN",
        Caste = "CAST",
        Cause = "CAUS",
        Census = "CENS",
        Change = "CHAN",
        Character = "CHAR",
        Child = "CHIL",
        ChildrenCount = "NCHI",
        Christening = "CHR",
        City = "CITY",
        Concatenation = "CONC",
        Confirmation = "CONF",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        ConfirmationLDS = "CONL",
        Continuation = "CONT",
        Copyright = "COPR",
        Corporate = "CORP",
        Country = "CTRY",
        Cremation = "CREM",
        Data = "DATA",
        Date = "DATE",
        Death = "DEAT",
        Descendants = "DESC",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        DescendantInt = "DESI",
        Destination = "DEST",
        Divorce = "DIV",
        DivorceFiled = "DIVF",
        Education = "EDUC",
        Email = "EMAIL",
        Emigration = "EMIG",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        Endowment = "ENDL",
        Engagement = "ENGA",
        Event = "EVEN",
        Fact = "FACT",
        Family = "FAM",
        FamilyChild = "FAMC",
        FamilyFile = "FAMF",
        FamilySpouse = "FAMS",
        Fax = "FAX",
        File = "FILE",
        FirstCommunion = "FCOM",
        Format = "FORM",
        Gedcom = "GEDC",
        GivenName = "GIVN",
        Graduation = "GRAD",
        Header = "HEAD",
        Husband = "HUSB",
        IdentificationNumber = "IDNO",
        Immigration = "IMMI",
        Individual = "INDI",
        Language = "LANG",
        Latitude = "LATI",
        Legatee = "LEGA",
        Longitude = "LONG",
        Map = "MAP",
        Marriage = "MARR",
        MarriageBan = "MARB",
        MarriageContract = "MARC",
        MarriageCount = "NMR",
        MarriageLicense = "MARL",
        MarriageSettlement = "MARS",
        Media = "MEDI",
        Name = "NAME",
        NamePrefix = "NPFX",
        NameSuffix = "NSFX",
        Nationality = "NATI",
        Naturalization = "NATU",
        Nickname = "NICK",
        Note = "NOTE",
        Object = "OBJE",
        Occupation = "OCCU",
        Ordinance = "ORDI",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        Ordination = "ORDN",
        Page = "PAGE",
        Pedigree = "PEDI",
        Phone = "PHON",
        Phonetic = "FONE",
        PhysicalDescription = "DSCR",
        Place = "PLAC",
        PostalCode = "POST",
        Probate = "PROB",
        Property = "PROP",
        Publication = "PUBL",
        QualityOfData = "QUAY",
        RecordFileNumber = "RFN",
        RecordIdNumber = "RIN",
        Reference = "REFN",
        Relationship = "RELA",
        Religion = "RELI",
        Repository = "REPO",
        Residence = "RESI",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        Restriction = "RESN",
        Retirement = "RETI",
        Role = "ROLE",
        Romanized = "ROMN",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        SealingChild = "SLGC",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        SealingSpouse = "SLGS",
        Sex = "SEX",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        SocialSecurityNumber = "SSN",
        Source = "SOUR",
        State = "STAE",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        Status = "STAT",
        /**
         * Obsoleted in Gedcom 5.5.5
         */
        Submission = "SUBN",
        Submitter = "SUBM",
        Surname = "SURN",
        SurnamePrefix = "SPFX",
        Temple = "TEMP",
        Text = "TEXT",
        Time = "TIME",
        Title = "TITL",
        Trailer = "TRLR",
        Type = "TYPE",
        Version = "VERS",
        Web = "WWW",
        Wife = "WIFE",
        Will = "WILL"
    }
}
declare module "tag/TagNonStandard" {
    /**
     * Opinionated enumeration of common non-standard Gedcom tags.
     */
    export const enum TagNonStandard {
        CharacterAlt = "CHARACTER"
    }
}
declare module "tag/index" {
    /**
     * @module Tags
     */
    export { Tag } from "tag/Tag";
    export { TagNonStandard } from "tag/TagNonStandard";
}
declare module "value/ValueAdoption" {
    export const enum ValueAdoption {
        Husband = "HUSB",
        Wife = "WIFE",
        Both = "BOTH"
    }
}
declare module "value/ValueCertainty" {
    export const enum ValueCertainty {
        Unreliable = 0,
        Questionable = 1,
        Secondary = 2,
        Primary = 3
    }
}
declare module "value/ValueCharacterEncoding" {
    export const enum ValueCharacterEncoding {
        Utf8 = "UTF-8",
        Unicode = "UNICODE",
        Ansel = "ANSEL",
        Ascii = "ASCII",
        Ansi = "ANSI"
    }
}
declare module "value/ValueEvent" {
    export const enum ValueEvent {
        Yes = "Y"
    }
}
declare module "value/ValueGedcomForm" {
    export const enum ValueGedcomForm {
        LineageLinked = "LINEAGE-LINKED"
    }
}
declare module "value/ValueLanguage" {
    export const enum ValueLanguage {
        Afrikaans = "Afrikaans",
        Albanian = "Albanian",
        AngloSaxon = "Anglo-Saxon",
        Catalan = "Catalan",
        CatalanSpn = "Catalan_Spn",
        Czech = "Czech",
        Danish = "Danish",
        Dutch = "Dutch",
        English = "English",
        Esperanto = "Esperanto",
        Estonian = "Estonian",
        Faroese = "Faroese",
        Finnish = "Finnish",
        French = "French",
        German = "German",
        Hawaiian = "Hawaiian",
        Hungarian = "Hungarian",
        Icelandic = "Icelandic",
        Indonesian = "Indonesian",
        Italian = "Italian",
        Latvian = "Latvian",
        Lithuanian = "Lithuanian",
        Navaho = "Navaho",
        Norwegian = "Norwegian",
        Polish = "Polish",
        Portuguese = "Portuguese",
        Romanian = "Romanian",
        SerboCroa = "Serbo_Croa",
        Slovak = "Slovak",
        Slovene = "Slovene",
        Spanish = "Spanish",
        Swedish = "Swedish",
        Turkish = "Turkish",
        Wendic = "Wendic",
        Amharic = "Amharic",
        Arabic = "Arabic",
        Armenian = "Armenian",
        Assamese = "Assamese",
        Belorusian = "Belorusian",
        Bengali = "Bengali",
        Braj = "Braj",
        Bulgarian = "Bulgarian",
        Burmese = "Burmese",
        Cantonese = "Cantonese",
        ChurchSlavic = "Church-Slavic",
        Dogri = "Dogri",
        Georgian = "Georgian",
        Greek = "Greek",
        Gujarati = "Gujarati",
        Hebrew = "Hebrew",
        Hindi = "Hindi",
        Japanese = "Japanese",
        Kannada = "Kannada",
        Khmer = "Khmer",
        Konkani = "Konkani",
        Korean = "Korean",
        Lahnda = "Lahnda",
        Lao = "Lao",
        Macedonian = "Macedonian",
        Maithili = "Maithili",
        Malayalam = "Malayalam",
        Mandarin = "Mandarin",
        Manipuri = "Manipuri",
        Marathi = "Marathi",
        Mewari = "Mewari",
        Nepali = "Nepali",
        Oriya = "Oriya",
        Pahari = "Pahari",
        Pali = "Pali",
        Panjabi = "Panjabi",
        Persian = "Persian",
        Prakrit = "Prakrit",
        Pusto = "Pusto",
        Rajasthani = "Rajasthani",
        Russian = "Russian",
        Sanskrit = "Sanskrit",
        Serb = "Serb",
        Tagalog = "Tagalog",
        Tamil = "Tamil",
        Telugu = "Telugu",
        Thai = "Thai",
        Tibetan = "Tibetan",
        Ukrainian = "Ukrainian",
        Urdu = "Urdu",
        Vietnamese = "Vietnamese",
        Yiddish = "Yiddish"
    }
}
declare module "value/ValueMediaType" {
    export const enum ValueMediaType {
        Audio = "audio",
        Book = "book",
        Card = "card",
        Electronic = "electronic",
        Fiche = "fiche",
        Film = "film",
        Magazine = "magazine",
        Manuscript = "manuscript",
        Map = "map",
        Newspaper = "newspaper",
        Photo = "photo",
        Tombstone = "tombstone",
        Video = "video"
    }
}
declare module "value/ValueMultimediaFormat" {
    export const enum ValueMultimediaFormat {
        Aac = "AAC",
        Avi = "AVI",
        Bmp = "BMP",
        Epub = "ePUB",
        Flac = "FLAC",
        Gif = "GIF",
        Jpeg = "JPEG",
        Jpg = "JPG",
        Mkv = "MKV",
        Mobi = "mobi",
        Mp3 = "MP3",
        Pcx = "PCX",
        Pdf = "PDF",
        Png = "PNG",
        Tiff = "TIFF",
        Tif = "TIF",
        Wav = "WAV"
    }
}
declare module "value/ValueNameType" {
    export const enum ValueNameType {
        Alias = "aka",
        Birth = "birth",
        Immigration = "immigrant",
        Maiden = "maiden",
        Married = "married"
    }
}
declare module "value/ValuePedigreeLinkageType" {
    export const enum ValuePedigreeLinkageType {
        Adopted = "adopted",
        Birth = "birth",
        Foster = "foster"
    }
}
declare module "value/ValuePhonetizationMethod" {
    export const enum ValuePhonetizationMethod {
        Hangul = "Hangul",
        Kana = "kana"
    }
}
declare module "value/ValueRole" {
    export const enum ValueRole {
        Child = "CHIL",
        Husband = "HUSB",
        Wife = "WIFE",
        Mother = "MOTH",
        Father = "FATH",
        Spouse = "SPOU"
    }
}
declare module "value/ValueRomanizationMethod" {
    export const enum ValueRomanizationMethod {
        Pinyin = "pinyin",
        Romaji = "romaji",
        Wadegiles = "wadegiles"
    }
}
declare module "value/ValueSex" {
    export const enum ValueSex {
        Male = "M",
        Female = "F",
        Intersex = "X",
        Unknown = "U",
        NotRecorded = "N"
    }
}
declare module "value/ValueSourceCertainty" {
    export const enum ValueSourceCertainty {
        Unreliable = 0,
        Questionable = 1,
        Secondary = 2,
        Primary = 3
    }
}
declare module "value/index" {
    /**
     * @module Values
     */
    export { ValueAdoption } from "value/ValueAdoption";
    export { ValueCertainty } from "value/ValueCertainty";
    export { ValueCharacterEncoding } from "value/ValueCharacterEncoding";
    export { ValueEvent } from "value/ValueEvent";
    export { ValueGedcomForm } from "value/ValueGedcomForm";
    export { ValueLanguage } from "value/ValueLanguage";
    export { ValueMediaType } from "value/ValueMediaType";
    export { ValueMultimediaFormat } from "value/ValueMultimediaFormat";
    export { ValueNameType } from "value/ValueNameType";
    export { ValuePedigreeLinkageType } from "value/ValuePedigreeLinkageType";
    export { ValuePhonetizationMethod } from "value/ValuePhonetizationMethod";
    export { ValueRole } from "value/ValueRole";
    export { ValueRomanizationMethod } from "value/ValueRomanizationMethod";
    export { ValueSex } from "value/ValueSex";
    export { ValueSourceCertainty } from "value/ValueSourceCertainty";
}
declare module "parse/error" {
    /**
     * The base type for all Gedcom related errors. All errors are currently also instances of {@link ErrorParse}.
     */
    export abstract class ErrorGedcomBase extends Error {
        protected constructor(message?: string);
    }
    /**
     * The base class of all parsing errors.
     */
    export class ErrorParse extends ErrorGedcomBase {
        readonly message: string;
        constructor(message: string);
    }
    /**
     * Thrown if it is unlikely a Gedcom file, for instance if a completely unrelated file was passed.
     */
    export class ErrorInvalidFileType extends ErrorParse {
    }
    /**
     * Thrown on likely Gedcom files if there was an error during the decoding of the characters.
     * Such an error can be muted by passing <code>false</code> to the <code>strict</code> parameter of a decoding method (for example, {@link decodeAnsel}).
     */
    export class ErrorGedcomDecoding extends ErrorParse {
        readonly illegalCode: number;
        constructor(message: string, illegalCode: number);
    }
    /**
     * Thrown on likely Gedcom file in rare occasions if the charset was detected but is not supported.
     * An example would be UTF-32.
     */
    export class ErrorUnsupportedCharset extends ErrorParse {
        readonly charset: string;
        constructor(message: string, charset: string);
    }
    /**
     * Thrown on likely Gedcom files if a line could not be tokenized properly.
     * This is perhaps the most common error in practice.
     */
    export class ErrorTokenization extends ErrorParse {
        readonly lineNumber: number;
        readonly line: string;
        constructor(message: string, lineNumber: number, line: string);
    }
    /**
     * The base class of all tree structuring errors.
     * Such errors can be thrown only after the tokenization phase has completed successfully.
     */
    export class ErrorTreeSyntax extends ErrorParse {
        readonly lineNumber: number;
        constructor(message: string, lineNumber: number);
    }
    /**
     * Thrown if a line is incorrectly nested.
     */
    export class ErrorInvalidNesting extends ErrorTreeSyntax {
        readonly lineNumber: number;
        readonly currentLevel: number;
        readonly level: number;
        constructor(message: string, lineNumber: number, currentLevel: number, level: number);
    }
    /**
     * Thrown if a concatenation or a continuation line is incorrectly used.
     */
    export class ErrorInvalidConcatenation extends ErrorTreeSyntax {
        readonly lineNumber: number;
        readonly kind: string;
        constructor(message: string, lineNumber: number, kind: string);
    }
    /**
     * Thrown if a record appears at a position other than the top-most level.
     */
    export class ErrorInvalidRecordDefinition extends ErrorTreeSyntax {
        constructor(message: string, lineNumber: number);
    }
    /**
     * Thrown if the file does not start with a header or does not end with a trailer.
     */
    export class ErrorTreeStructure extends ErrorParse {
        constructor(message: string);
    }
    /**
     * @deprecated This error cannot occur, an empty tree would throw a {@link ErrorInvalidFileType} instead.
     */
    export class ErrorEmptyTree extends ErrorTreeStructure {
        constructor(message: string);
    }
    /**
     * The base class of all indexing errors.
     * Such errors can occur if an inconsistency is discovered while indexing the data.
     */
    export class ErrorIndexing extends ErrorParse {
        constructor(message: string);
    }
    /**
     * Thrown if a duplicate pointer is discovered.
     */
    export class ErrorDuplicatePointer extends ErrorIndexing {
        readonly lineNumber: number;
        readonly lineNumberOriginalDefinition: number;
        readonly pointer: string;
        constructor(message: string, lineNumber: number, lineNumberOriginalDefinition: number, pointer: string);
    }
}
declare module "parse/tokenizer" {
    /**
     * Processes the input string and return a tokenized, line by line, high-level representation.
     * @param input The input file, represented as a single string
     * @param strict When set to <code>false</code> any parsing exception will not be reported
     */
    export const tokenize: (input: string, strict?: boolean) => Iterable<RegExpExecArray>;
}
declare module "parse/structurer" {
    import { TreeNodeRoot } from "tree/index";
    /**
     * Builds a tree from tokenized Gedcom lines.
     * @param lines An iterable of regular expression matches, which format is defined in {@link tokenize}
     * @param noInlineContinuations See {@link GedcomReadingOptions.noInlineContinuations}
     * @param progressCallback See {@link GedcomReadingPhase.progressCallback}
     */
    export const buildTree: (lines: Iterable<RegExpExecArray>, noInlineContinuations?: boolean, progressCallback?: ((charsRead: number) => void) | null) => TreeNodeRoot;
}
declare module "parse/decoding/common" {
    /**
     * The iteration interval at which the next progress call should be performed.
     */
    export const BYTES_INTERVAL = 200000;
}
declare module "parse/decoding/FileDecoder" {
    /**
     * The signature of a decoder.
     */
    export type FileDecoder = (buffer: ArrayBuffer, progressCallback?: (bytesRead: number) => void, strict?: boolean) => string;
}
declare module "parse/decoding/ansel" {
    import { FileDecoder } from "parse/decoding/FileDecoder";
    export const decodeAnsel: FileDecoder;
}
declare module "parse/decoding/cp1252" {
    import { FileDecoder } from "parse/decoding/FileDecoder";
    export const decodeCp1252: FileDecoder;
}
declare module "parse/decoding/utf" {
    import { FileDecoder } from "parse/decoding/FileDecoder";
    export const BOM_UTF8: number[];
    export const BOM_UTF16_BE: number[];
    export const BOM_UTF16_LE: number[];
    export const BOM_UTF32_BE: number[];
    export const BOM_UTF32_LE: number[];
    export const DECODE_UTF8 = "utf-8";
    export const DECODE_UTF16_BE = "utf-16be";
    export const DECODE_UTF16_LE = "utf-16le";
    export const decodeUtf: FileDecoder;
    export const decodeUtf8: FileDecoder;
    export const decodeUtf16be: FileDecoder;
    export const decodeUtf16le: FileDecoder;
    export const decodeUtfBOM: (buffer: ArrayBuffer, progressCallback?: ((bytesRead: number) => void) | undefined) => {
        output: string;
        bomCharset: string | null;
    };
}
declare module "parse/decoding/macintosh" {
    import { FileDecoder } from "parse/decoding/FileDecoder";
    export const decodeMacintosh: FileDecoder;
}
declare module "parse/decoding/cp850" {
    import { FileDecoder } from "parse/decoding/FileDecoder";
    export const decodeCp850: FileDecoder;
}
declare module "parse/decoding/index" {
    export { decodeAnsel } from "parse/decoding/ansel";
    export { decodeCp1252 } from "parse/decoding/cp1252";
    export { decodeUtf, decodeUtfBOM, decodeUtf8, decodeUtf16le, decodeUtf16be, BOM_UTF8, BOM_UTF16_BE, BOM_UTF16_LE, BOM_UTF32_BE, BOM_UTF32_LE } from "parse/decoding/utf";
    export { decodeMacintosh } from "parse/decoding/macintosh";
    export { decodeCp850 } from "parse/decoding/cp850";
}
declare module "parse/decoder" {
    /**
     * Supported Gedcom file encoding schemes.
     */
    export const enum FileEncoding {
        Utf8 = "UTF-8",
        Ansel = "ANSEL",
        Cp1252 = "Cp1252",
        Macintosh = "Macintosh",
        Cp850 = "Cp850",
        Utf16be = "UTF-16be",
        Utf16le = "UTF-16le"
    }
    /**
     * Early detectable file metadata.
     * Can be used to infer the file encoding with high confidence.
     */
    export interface FileMetadata {
        /**
         * The source encoding value, as defined in the header.
         */
        sourceEncoding: string | null;
        /**
         * The source provider value, as defined in the header.
         */
        sourceProvider: string | null;
        /**
         * The source provider's version value, as defined in the header.
         */
        sourceProviderVersion: string | null;
        /**
         * Whether this file contains a byte order marker (BOM).
         */
        fileHasBOM: boolean;
    }
    /**
     * Extracts the file metadata (see {@link FileMetadata}). The metadata can then be used to guess the actual charset of the file.
     * To circumvent the bootstrapping problem this function restricts its reading to the first lines of the file only, and
     * decodes them as UTF-8.
     * @param buffer The content of the file
     * @param maxPeekBytes Maximum number of bytes to read
     * @param maxPeekLines Maximum number of lines to read
     */
    export const getFileMetadata: (buffer: ArrayBuffer, maxPeekBytes?: number, maxPeekLines?: number) => FileMetadata;
    /**
     * Detects the file charset using a set of heuristics. Has proven to work great in practice.
     * If you encounter a file for which this procedure doesn't work as intended please do open an issue
     * at: https://github.com/arbre-app/read-gedcom/issues.
     * @param buffer The content of the file
     */
    export const detectCharset: (buffer: ArrayBuffer) => FileEncoding;
}
declare module "parse/GedcomReadingPhase" {
    /**
     * Reading phases.
     */
    export const enum GedcomReadingPhase {
        Decoding = 0,
        TokenizationAndStructuring = 1,
        Indexing = 2,
        Freezing = 3
    }
}
declare module "parse/GedcomReadingOptions" {
    import { FileEncoding } from "parse/decoder";
    import { GedcomReadingPhase } from "parse/GedcomReadingPhase";
    /**
     * Options to control the parsing of the Gedcom tree.
     */
    export interface GedcomReadingOptions {
        /**
         * When set to <code>true</code> completely disabled the indexing in the tree.
         * This option can be safely set without affecting the correctness of the other components that may use the tree.
         * However, it will incur a slowdown when querying the tree.
         */
        noIndex?: boolean;
        /**
         * When set to <code>true</code> the backwards references of the root node will not be stored (namely spouse and sibling relationships).
         * This option only has an effect when {@link noIndex} is not set, and as for that option it will not affect correctness of other components.
         * It will incur a slowdown when querying backward references.
         */
        noBackwardsReferencesIndex?: boolean;
        /**
         * When set to <code>true</code> the {@link Tag.Concatenation} and {@link Tag.Continuation} special tags will not get interpreted and will be preserved in the resulting tree.
         * This option might affect the behavior of other components.
         * Otherwise the tags will get inlined according to their respective semantics, and thus will never appear in the output.
         */
        noInlineContinuations?: boolean;
        /**
         * When set to <code>true</code> all the {@link TreeNode} in the tree will be frozen and modifications will be forbidden by the runtime.
         * Otherwise the objects will remain normal.
         * This option is not enabled by default for performance reasons.
         */
        doFreeze?: boolean;
        /**
         * An optional callback used to track the progress.
         * Can also be used to implement preemptive multitasking (unblock the rendering thread).
         * @param phase The current phase
         * @param progress The progress of the phase, indicated by a number between <code>0</code> and <code>1</code>, or <code>null</code> if the progress cannot be determined
         */
        progressCallback?: (phase: GedcomReadingPhase, progress: number | null) => void;
        /**
         * When set, disables the automatic charset detection mechanism and forces the parser to decode the file using the specified charset.
         * This is an escape hatch and its usage is not recommended; if you encounter issues with the detection mechanism please open a ticket instead.
         */
        forcedCharset?: FileEncoding;
        /**
         * When set to <code>true</code>, illegally encoded data will raise an exception.
         * This can occur when dealing with ANSEL encoded data.
         * The default behavior is the insertion of a unicode replacement character.
         */
        doStrictDecoding?: boolean;
        /**
         * When set to <code>true</code>, the {@link TreeNode._index} attribute will be non-enumerable.
         * As a consequence, {@link JSON.stringify} will not serialize the index.
         * It is however still possible to recompute the index, by calling {@link indexTree}.
         */
        doHideIndex?: boolean;
    }
}
declare module "parse/indexer" {
    import { TreeNodeRoot } from "tree/index";
    /**
     * Computes an index for each node in the tree.
     * This operation is idempotent: applying several times will not have further effects (but will cost resources as the whole tree will be traversed anyway).
     * @param rootNode The root node
     * @param noBackwardsReferencesIndex See {@link GedcomReadingOptions.noBackwardsReferencesIndex}
     * @param doHideIndex See {@link GedcomReadingOptions.doHideIndex}
     * @param progressCallback See {@link GedcomReadingOptions.progressCallback}
     * @category Gedcom parser
     */
    export const indexTree: (rootNode: TreeNodeRoot, noBackwardsReferencesIndex?: boolean, doHideIndex?: boolean, progressCallback?: (() => void) | null) => void;
}
declare module "parse/reader" {
    import { TreeNodeRoot } from "tree/index";
    import { GedcomReadingOptions } from "parse/GedcomReadingOptions";
    /**
     * Reads a Gedcom file and returns it as a tree representation.
     * @param buffer The content of the file
     * @param options Optional parameters
     * @throws ErrorParse If the file cannot be interpreted correctly
     * @category Gedcom parser
     */
    export const parseGedcom: (buffer: ArrayBuffer, options?: GedcomReadingOptions) => TreeNodeRoot;
}
declare module "parse/index" {
    /**
     * @module Parsing
     */
    export * from "parse/value/index";
    export { parseGedcom } from "parse/reader";
    /**
     * @category Gedcom parser
     */
    export { GedcomReadingOptions } from "parse/GedcomReadingOptions";
    /**
     * @category Gedcom parser
     */
    export { GedcomReadingPhase } from "parse/GedcomReadingPhase";
    /**
     * @category Errors
     */
    export { ErrorGedcomBase, ErrorParse, ErrorInvalidFileType, ErrorUnsupportedCharset, ErrorTokenization, ErrorTreeSyntax, ErrorInvalidNesting, ErrorInvalidConcatenation, ErrorInvalidRecordDefinition, ErrorTreeStructure, ErrorEmptyTree, ErrorIndexing, ErrorDuplicatePointer, } from "parse/error";
    export { indexTree } from "parse/indexer";
}
declare module "meta/decorators" {
    /**
     * This annotation controls the enumerability of a property.
     * @param value
     */
    export const enumerable: (value: boolean) => (target: any, prop: string, descriptor?: PropertyDescriptor) => void;
}
declare module "meta/mixins" {
    /**
     * A type representing an arbitrary function.
     */
    export type AnyFunction<A = any> = (...input: any[]) => A;
    /**
     * A type representing an arbitrary constructor.
     */
    export type AnyConstructor<T = {}> = new (...args: any[]) => T;
    /**
     * A type representing a mixin function.
     */
    export type Mixin<T extends AnyFunction> = InstanceType<ReturnType<T>>;
}
declare module "meta/index" {
    export { enumerable } from "meta/decorators";
    export { AnyFunction, AnyConstructor, Mixin } from "meta/mixins";
}
declare module "selection/SelectionAny" {
    import { AnyConstructor } from "meta/index";
    import { TreeNode, TreeNodeRoot } from "tree/index";
    import { SelectionGedcom } from "selection/internal";
    /**
     * A selection of Gedcom nodes, represented in an array-like datastructure.
     */
    export class SelectionAny implements ArrayLike<TreeNode> {
        #private;
        /**
         * The number of nodes in the selection.
         * @category Base
         */
        length: number;
        /**
         * The nodes in the selection.
         * @category Base
         */
        [n: number]: TreeNode;
        /**
         * The common root node of the elements in this selection.
         * @category Base
         */
        rootNode: TreeNodeRoot;
        /**
         * @param rootNode
         * @param nodes
         * @category Base
         */
        constructor(rootNode: TreeNodeRoot, nodes: TreeNode[]);
        /**
         * Returns an array of {@link TreeNode.tag}.
         * @category Base
         */
        tag(): (string | null)[];
        /**
         * Returns an array of {@link TreeNode.pointer}.
         * @category Base
         */
        pointer(): (string | null)[];
        /**
         * Returns an array of {@link TreeNode.value}.
         * @category Base
         */
        value(): (string | null)[];
        /**
         * Calls {@link value} and filters out <code>null</code> values.
         * @category Base
         */
        valueNonNull(): string[];
        /**
         * Wraps the value of {@link rootNode} in {@link SelectionGedcom}.
         * The selection will contain exactly one node.
         * @category Base
         */
        root(): SelectionGedcom;
        /**
         * Query the direct children of this node.
         * It is possible to efficiently filter the results by tag and pointer.
         * Leaving either or both of these parameter empty will result in a wildcard behavior (not filtering).
         * In most cases this method is not useful as the functionality is already implemented in the subclasses through various more precise methods.
         * Returns an array of children.
         * @param tag Optionally filter the results by their Gedcom tag
         * @param pointer Optionally filter the result by their pointer value
         * @category Base
         */
        get(tag?: string | string[] | null, pointer?: string | string[] | null): SelectionAny;
        /**
         * Query the direct children of this node.
         * It is possible to efficiently filter the results by tag and pointer.
         * Leaving either or both of these parameter empty will result in a wildcard behavior (not filtering).
         * In most cases this method is not useful as the functionality is already implemented in the subclasses through various more precise methods.
         * Returns an array of children.
         * Additionally, allows the specification of an adapter class.
         * @param tag Optionally filter the results by their Gedcom tag
         * @param pointer Optionally filter the result by their pointer value
         * @param adapter The adapter class, see {@link as}
         * @category Base
         */
        get<N extends SelectionAny>(tag: string | string[] | null, pointer: string | string[] | null, adapter: AnyConstructor<N>): N;
        /**
         * Filter nodes from the selection based on a predicate.
         * @param f The filtering predicate
         * @category Base
         */
        filter(f: (node: TreeNode) => boolean): this;
        /**
         * Filter lifted nodes from the selection based on a predicate.
         * The argument is a selection of one node.
         * @param f The filtering predicate
         * @category Base
         */
        filterSelect(f: (node: this) => boolean): this;
        /**
         * View this selection as a different type. This method can be used to extend functionality for non-standard Gedcom files.
         * @param Adapter The class adapter
         * @category Base
         */
        as<N extends SelectionAny>(Adapter: AnyConstructor<N>): N;
        /**
         * Export the selection as an array of nodes.
         * The inverse operation is {@link of}.
         * @category Base
         */
        array(): TreeNode[];
        /**
         * Exports the selection as an array of selections of one element.
         * @category Base
         */
        arraySelect(): this[];
        /**
         * Returns a concatenation of two selections.
         * The right hand side selection should be a subtype of the left hand side's.
         * The resulting selection will be the same type as the left hand side's.
         * @param other The right hand side selection
         * @category Base
         */
        concatenate<N extends this>(other: N): this;
        /**
         * Returns a concatenation of two selections.
         * The right hand side selection should be a subtype of the left hand side's.
         * The resulting selection will be the same type as the left hand side's, with the elements of the right hand side's first.
         * @param other The right hand side selection
         * @category Base
         */
        concatenateLeft<N extends this>(other: N): this;
        /**
         * Returns a sorted selection, with respect to the comparator.
         * The default comparator relies on the {@link TreeNode.indexSource} attribute.
         * @param comparator The comparator
         * @category Base
         */
        sorted(comparator?: (a: TreeNode, b: TreeNode) => number): this;
        /**
         * Checks whether two selections are equal.
         * Note that the strategy used here is reference equality, hence for this method to return <code>true</code>, the nodes must be the same references (and in the same order).
         * @param other The selection to compare it against
         * @category Base
         */
        equals(other: SelectionAny): boolean;
        /**
         * Returns a string representation for this selection.
         * @category Base
         */
        toString(): string;
        /**
         * Create a selection from an array of nodes.
         * It is highly recommended (but not required) for the nodes to be at the same logical level in the hierarchy.
         * The inverse operation is {@link array}.
         * @param previous The previous selection, required to inherit the reference to the root
         * @param nodes The nodes to be included in the selection
         * @category Base
         */
        static of(previous: SelectionAny, nodes: TreeNode[] | TreeNode): SelectionAny;
        /**
         * Create a selection from an array of nodes.
         * It is highly recommended (but not required) for the nodes to be at the same logical level in the hierarchy.
         * The inverse operation is {@link array}.
         * @param previous The previous selection, required to inherit the reference to the root
         * @param nodes The nodes to be included in the selection
         * @param Adapter The adapter class, see {@link as}
         * @category Base
         */
        static of<N extends SelectionAny>(previous: SelectionAny, nodes: TreeNode[] | TreeNode, Adapter: AnyConstructor<N>): N;
    }
}
declare module "selection/base/SelectionRecord" {
    import { SelectionAny, SelectionChanged, SelectionReferenceNumber } from "selection/internal";
    export class SelectionRecord extends SelectionAny {
        getReferenceNumber(): SelectionReferenceNumber;
        getRecordIdentificationNumber(): SelectionAny;
        getChanged(): SelectionChanged;
    }
}
declare module "selection/base/index" {
    export { SelectionRecord } from "selection/base/SelectionRecord";
}
declare module "selection/mixin/SelectionWithAddressMixin" {
    import { AnyConstructor } from "meta/index";
    import { SelectionAddress, SelectionAny } from "selection/internal";
    /**
     * @ignore
     */
    export const SelectionWithAddressMixin: <C extends AnyConstructor<SelectionAny>>(Base: C) => C & AnyConstructor<SelectionWithAddressMixin>;
    export interface SelectionWithAddressMixin {
        getAddress(): SelectionAddress;
        getPhoneNumber(): SelectionAny;
        getEmailAddress(): SelectionAny;
        getFaxAddress(): SelectionAny;
        getWebAddress(): SelectionAny;
    }
}
declare module "selection/mixin/SelectionWithMultimediaMixin" {
    import { AnyConstructor } from "meta/index";
    import { SelectionAny, SelectionMultimediaReference } from "selection/internal";
    /**
     * @ignore
     */
    export const SelectionWithMultimediaMixin: <C extends AnyConstructor<SelectionAny>>(Base: C) => C & AnyConstructor<SelectionWithMultimediaMixin>;
    export interface SelectionWithMultimediaMixin {
        getMultimedia(): SelectionMultimediaReference;
    }
}
declare module "selection/mixin/SelectionWithNoteMixin" {
    import { AnyConstructor } from "meta/index";
    import { SelectionAny, SelectionNoteReferenceMixed } from "selection/internal";
    /**
     * @ignore
     */
    export const SelectionWithNoteMixin: <C extends AnyConstructor<SelectionAny>>(Base: C) => C & AnyConstructor<SelectionWithNoteMixin>;
    export interface SelectionWithNoteMixin {
        /**
         * The note(s) associated to this attribute.
         * <table>
         *  <tr><th>Tag</th><td><code>NOTE</code></td></tr>
         *  <tr><th>Multiplicity</th><td><code>*</code></td></tr>
         * </table>
         */
        getNote(): SelectionNoteReferenceMixed;
    }
}
declare module "selection/mixin/SelectionWithNoteSourceCitationMixin" {
    import { AnyConstructor, Mixin } from "meta/index";
    import { SelectionAny, SelectionWithNoteMixin, SelectionWithSourceCitationMixin } from "selection/internal";
    /**
     * @ignore
     */
    export const SelectionWithNoteSourceCitationMixin: <C extends AnyConstructor<SelectionAny>>(Base: C) => C & AnyConstructor<SelectionWithSourceCitationMixin> & AnyConstructor<SelectionWithNoteMixin>;
    export type SelectionWithNoteSourceCitationMixin = Mixin<typeof SelectionWithNoteSourceCitationMixin>;
}
declare module "selection/mixin/SelectionWithSourceCitationMixin" {
    import { AnyConstructor } from "meta/index";
    import { SelectionAny, SelectionSourceCitation } from "selection/internal";
    /**
     * @ignore
     */
    export const SelectionWithSourceCitationMixin: <C extends AnyConstructor<SelectionAny>>(Base: C) => C & AnyConstructor<SelectionWithSourceCitationMixin>;
    export interface SelectionWithSourceCitationMixin {
        getSourceCitation(): SelectionSourceCitation;
    }
}
declare module "selection/mixin/index" {
    export { SelectionWithAddressMixin } from "selection/mixin/SelectionWithAddressMixin";
    export { SelectionWithMultimediaMixin } from "selection/mixin/SelectionWithMultimediaMixin";
    export { SelectionWithNoteMixin } from "selection/mixin/SelectionWithNoteMixin";
    export { SelectionWithNoteSourceCitationMixin } from "selection/mixin/SelectionWithNoteSourceCitationMixin";
    export { SelectionWithSourceCitationMixin } from "selection/mixin/SelectionWithSourceCitationMixin";
}
declare module "selection/SelectionEvent" {
    import { SelectionWithAddressMixin, SelectionWithMultimediaMixin } from "selection/mixin/index";
    import { SelectionAny, SelectionDate, SelectionPlace } from "selection/internal";
    const SelectionEvent_base: typeof SelectionAny & import("meta").AnyConstructor<import("selection/mixin").SelectionWithSourceCitationMixin> & import("meta").AnyConstructor<import("selection/mixin").SelectionWithNoteMixin> & import("meta").AnyConstructor<SelectionWithMultimediaMixin> & import("meta").AnyConstructor<SelectionWithAddressMixin>;
    export class SelectionEvent extends SelectionEvent_base {
        valueAsHappened(): (boolean | null)[];
        getType(): SelectionAny;
        getDate(): SelectionDate;
        getPlace(): SelectionPlace;
        getResponsibleAgency(): SelectionAny;
        getReligiousAffiliation(): SelectionAny;
        getCause(): SelectionAny;
    }
}
declare module "selection/SelectionNamePieces" {
    import { SelectionAny } from "selection/internal";
    const SelectionNamePieces_base: typeof SelectionAny & import("meta").AnyConstructor<import("selection/mixin").SelectionWithSourceCitationMixin> & import("meta").AnyConstructor<import("selection/mixin").SelectionWithNoteMixin>;
    export class SelectionNamePieces extends SelectionNamePieces_base {
        getPrefixName(): SelectionAny;
        getGivenName(): SelectionAny;
        getNickname(): SelectionAny;
        getPrefixSurname(): SelectionAny;
        getSurname(): SelectionAny;
        getNameSuffix(): SelectionAny;
    }
}
declare module "selection/SelectionMetaEvent" {
    import { SelectionAny } from "selection/internal";
    export class SelectionMetaEvent extends SelectionAny {
        valueAsArray(): (string[] | null)[];
    }
}
declare module "selection/SelectionDate" {
    import { SelectionAny } from "selection/internal";
    export class SelectionDate extends SelectionAny {
        valueAsDate(): (import("parse").ValueDate | null)[];
    }
}
declare module "selection/SelectionReference" {
    import { SelectionAny } from "selection/internal";
    export class SelectionReference extends SelectionAny {
    }
}
declare module "selection/SelectionFamilyReference" {
    import { SelectionReference } from "selection/internal";
    export class SelectionFamilyReference extends SelectionReference {
        getFamilyRecord(): import("selection/SelectionFamilyRecord").SelectionFamilyRecord;
    }
}
declare module "selection/SelectionIndividualEvent" {
    import { SelectionAge, SelectionEvent } from "selection/internal";
    export class SelectionIndividualEvent extends SelectionEvent {
        getAge(): SelectionAge;
    }
}
declare module "selection/SelectionAddress" {
    import { SelectionAny } from "selection/internal";
    export class SelectionAddress extends SelectionAny {
        getAddressLine1(): SelectionAny;
        getAddressLine2(): SelectionAny;
        getAddressLine3(): SelectionAny;
        getCity(): SelectionAny;
        getState(): SelectionAny;
        getPostalCode(): SelectionAny;
        getCountry(): SelectionAny;
    }
}
declare module "selection/SelectionAge" {
    import { SelectionAny } from "selection/internal";
    export class SelectionAge extends SelectionAny {
        valueAsAge(): (import("parse").ValueAge | null)[];
    }
}
declare module "selection/SelectionAssociation" {
    import { SelectionAny } from "selection/internal";
    const SelectionAssociation_base: typeof SelectionAny & import("meta").AnyConstructor<import("selection/mixin").SelectionWithSourceCitationMixin> & import("meta").AnyConstructor<import("selection/mixin").SelectionWithNoteMixin>;
    export class SelectionAssociation extends SelectionAssociation_base {
        getRelation(): SelectionAny;
    }
}
declare module "selection/SelectionChanged" {
    import { SelectionAny, SelectionDateExact } from "selection/internal";
    import { SelectionWithNoteMixin } from "selection/mixin/index";
    const SelectionChanged_base: typeof SelectionAny & import("meta").AnyConstructor<SelectionWithNoteMixin>;
    export class SelectionChanged extends SelectionChanged_base {
        getExactDate(): SelectionDateExact;
    }
}
declare module "selection/SelectionChildFamilyLink" {
    import { SelectionPedigreeLinkageType, SelectionAny } from "selection/internal";
    import { SelectionWithNoteMixin } from "selection/mixin/index";
    const SelectionChildFamilyLink_base: typeof SelectionAny & import("meta").AnyConstructor<SelectionWithNoteMixin>;
    export class SelectionChildFamilyLink extends SelectionChildFamilyLink_base {
        getFamilyRecord(): import("selection/SelectionFamilyRecord").SelectionFamilyRecord;
        getPedigreeLinkageType(): SelectionPedigreeLinkageType;
    }
}
declare module "selection/SelectionCitationData" {
    import { SelectionDate, SelectionAny } from "selection/internal";
    export class SelectionCitationData extends SelectionAny {
        getDate(): SelectionDate;
        getText(): SelectionAny;
    }
}
declare module "selection/SelectionCitationEvent" {
    import { SelectionMetaEvent } from "selection/internal";
    export class SelectionCitationEvent extends SelectionMetaEvent {
        getRole(): import("selection/SelectionAny").SelectionAny;
    }
}
declare module "selection/SelectionCoordinates" {
    import { SelectionAny, SelectionLatitude, SelectionLongitude } from "selection/internal";
    export class SelectionCoordinates extends SelectionAny {
        getLatitude(): SelectionLatitude;
        getLongitude(): SelectionLongitude;
    }
}
declare module "selection/SelectionCorporation" {
    import { SelectionWithAddressMixin } from "selection/mixin/index";
    import { SelectionAny } from "selection/internal";
    const SelectionCorporation_base: typeof SelectionAny & import("meta").AnyConstructor<SelectionWithAddressMixin>;
    export class SelectionCorporation extends SelectionCorporation_base {
    }
}
declare module "selection/SelectionDataSource" {
    import { SelectionDate, SelectionAny } from "selection/internal";
    export class SelectionDataSource extends SelectionAny {
        getDate(): SelectionDate;
        getCopyright(): SelectionAny;
    }
}
declare module "selection/SelectionDateExact" {
    import { SelectionTime, SelectionAny } from "selection/internal";
    export class SelectionDateExact extends SelectionAny {
        valueAsExactDate(): (import("parse").ValueExactDate | null)[];
        getExactTime(): SelectionTime;
    }
}
declare module "selection/SelectionDatePeriod" {
    import { SelectionDate } from "selection/internal";
    export class SelectionDatePeriod extends SelectionDate {
        valueAsDatePeriod(): (import("parse").ValueDatePeriodFrom | import("parse").ValueDatePeriodTo | null)[];
    }
}
declare module "selection/SelectionDatePunctual" {
    import { SelectionAny } from "selection/internal";
    export class SelectionDatePunctual extends SelectionAny {
        valueAsDate(): (import("parse").ValueDateInterpreted | import("parse").ValueDateNormal | null)[];
    }
}
declare module "selection/SelectionEventsRecorded" {
    import { SelectionDatePeriod, SelectionMetaEvent, SelectionPlace } from "selection/internal";
    export class SelectionEventsRecorded extends SelectionMetaEvent {
        getPlace(): SelectionPlace;
        getDatePeriod(): SelectionDatePeriod;
    }
}
declare module "selection/SelectionFamilyEvent" {
    import { SelectionSpouseEventDetails, SelectionEvent } from "selection/internal";
    export class SelectionFamilyEvent extends SelectionEvent {
        getHusbandDetails(): SelectionSpouseEventDetails;
        getWifeDetails(): SelectionSpouseEventDetails;
    }
}
declare module "selection/SelectionFamilyRecord" {
    import { SelectionWithMultimediaMixin } from "selection/mixin/index";
    import { SelectionIndividualReference, SelectionFamilyEvent } from "selection/internal";
    import { SelectionRecord } from "selection/base/index";
    const SelectionFamilyRecord_base: typeof SelectionRecord & import("meta").AnyConstructor<import("selection/mixin").SelectionWithSourceCitationMixin> & import("meta").AnyConstructor<import("selection/mixin").SelectionWithNoteMixin> & import("meta").AnyConstructor<SelectionWithMultimediaMixin>;
    export class SelectionFamilyRecord extends SelectionFamilyRecord_base {
        getEventAnnulment(): SelectionFamilyEvent;
        getEventCensus(): SelectionFamilyEvent;
        getEventDivorce(): SelectionFamilyEvent;
        getEventDivorceFiled(): SelectionFamilyEvent;
        getEventEngagement(): SelectionFamilyEvent;
        getEventMarriageBann(): SelectionFamilyEvent;
        getEventMarriageContract(): SelectionFamilyEvent;
        getEventMarriage(): SelectionFamilyEvent;
        getEventMarriageLicense(): SelectionFamilyEvent;
        getEventMarriageSettlement(): SelectionFamilyEvent;
        getEventResidence(): SelectionFamilyEvent;
        getEventOther(): SelectionFamilyEvent;
        getHusband(): SelectionIndividualReference;
        getWife(): SelectionIndividualReference;
        getChild(): SelectionIndividualReference;
        getChildrenCount(): import("selection/SelectionAny").SelectionAny;
    }
}
declare module "selection/SelectionFamilyReferenceAdoption" {
    import { SelectionAdoption, SelectionFamilyReference } from "selection/internal";
    export class SelectionFamilyReferenceAdoption extends SelectionFamilyReference {
        getAdoptedByWhom(): SelectionAdoption;
    }
}
declare module "selection/SelectionGedcomFile" {
    import { SelectionGedcomVersion, SelectionGedcomForm, SelectionAny } from "selection/internal";
    export class SelectionGedcomFile extends SelectionAny {
        getVersion(): SelectionGedcomVersion;
        getGedcomForm(): SelectionGedcomForm;
    }
}
declare module "selection/SelectionGedcomForm" {
    import { SelectionAny } from "selection/internal";
    export class SelectionGedcomForm extends SelectionAny {
        getVersion(): SelectionAny;
        getName(): SelectionAny;
    }
}
declare module "selection/SelectionGedcomSource" {
    import { SelectionCorporation, SelectionDataSource, SelectionAny } from "selection/internal";
    export class SelectionGedcomSource extends SelectionAny {
        getVersion(): SelectionAny;
        getName(): SelectionAny;
        getCorporation(): SelectionCorporation;
        getDataSource(): SelectionDataSource;
    }
}
declare module "selection/SelectionGedcom" {
    import { AnyConstructor } from "meta/index";
    import { SelectionAny, SelectionFamilyRecord, SelectionHeader, SelectionIndividualRecord, SelectionMultimediaRecord, SelectionNoteRecord, SelectionRepositoryRecord, SelectionSourceRecord, SelectionSubmitterRecord } from "selection/internal";
    import { SelectionRecord } from "selection/base/index";
    /**
     * The root of a Gedcom file.
     * Remark that the actual root is a pseudo node, and hence will store <code>null</code> for the attributes {@link tag}, {@link pointer} and {@link value}.
     */
    export class SelectionGedcom extends SelectionAny {
        getHeader(): SelectionHeader;
        /**
         * @deprecated This method does the same thing as {@link get}; use that one instead
         */
        getRecord<R extends SelectionRecord>(tag: string | string[] | null, pointer: string | string[] | null, SelectionAdapter: AnyConstructor<R>): R;
        getSubmitterRecord(pointer?: string | string[] | null): SelectionSubmitterRecord;
        getIndividualRecord(pointer?: string | string[] | null): SelectionIndividualRecord;
        getFamilyRecord(pointer?: string | string[] | null): SelectionFamilyRecord;
        getMultimediaRecord(pointer?: string | string[] | null): SelectionMultimediaRecord;
        getNoteRecord(pointer?: string | string[] | null): SelectionNoteRecord;
        getSourceRecord(pointer?: string | string[] | null): SelectionSourceRecord;
        getRepositoryRecord(pointer?: string | string[] | null): SelectionRepositoryRecord;
    }
}
declare module "selection/SelectionGedcomVersion" {
    import { SelectionAny } from "selection/internal";
    export class SelectionGedcomVersion extends SelectionAny {
        valueAsVersion(): ((number[] & ([number, number, number] | [number, number])) | null)[];
    }
}
declare module "selection/SelectionHeader" {
    import { SelectionGedcomFile, SelectionCharacterEncoding, SelectionGedcomSource, SelectionDateExact, SelectionSubmitterReference, SelectionAny } from "selection/internal";
    import { SelectionWithNoteMixin } from "selection/mixin/index";
    const SelectionHeader_base: typeof SelectionAny & import("meta").AnyConstructor<SelectionWithNoteMixin>;
    export class SelectionHeader extends SelectionHeader_base {
        getGedcomFile(): SelectionGedcomFile;
        getCharacterEncoding(): SelectionCharacterEncoding;
        getSourceSystem(): SelectionGedcomSource;
        getDestinationSystem(): SelectionAny;
        getFileCreationDate(): SelectionDateExact;
        getLanguage(): SelectionAny;
        getSubmitterReference(): SelectionSubmitterReference;
        getFilename(): SelectionAny;
        getCopyright(): SelectionAny;
    }
}
declare module "selection/SelectionIndividualAttribute" {
    import { SelectionIndividualEvent } from "selection/internal";
    export class SelectionIndividualAttribute extends SelectionIndividualEvent {
        getType(): import("selection/SelectionAny").SelectionAny;
    }
}
declare module "selection/SelectionIndividualEventFamilyAdoption" {
    import { SelectionFamilyReferenceAdoption, SelectionIndividualEvent } from "selection/internal";
    export class SelectionIndividualEventFamilyAdoption extends SelectionIndividualEvent {
        getFamilyAsChildReference(): SelectionFamilyReferenceAdoption;
    }
}
declare module "selection/SelectionIndividualEventFamily" {
    import { SelectionFamilyReference, SelectionIndividualEvent } from "selection/internal";
    export class SelectionIndividualEventFamily extends SelectionIndividualEvent {
        getFamilyAsChildReference(): SelectionFamilyReference;
    }
}
declare module "selection/SelectionIndividualRecord" {
    import { SelectionWithMultimediaMixin } from "selection/mixin/index";
    import { SelectionFamilyRecord, SelectionName, SelectionSex, SelectionIndividualEventFamily, SelectionIndividualEventFamilyAdoption, SelectionIndividualEvent, SelectionIndividualAttribute, SelectionChildFamilyLink, SelectionSpouseFamilyLink, SelectionAssociation } from "selection/internal";
    import { SelectionRecord } from "selection/base/index";
    const SelectionIndividualRecord_base: typeof SelectionRecord & import("meta").AnyConstructor<import("selection/mixin").SelectionWithSourceCitationMixin> & import("meta").AnyConstructor<import("selection/mixin").SelectionWithNoteMixin> & import("meta").AnyConstructor<SelectionWithMultimediaMixin>;
    /**
     * An individual record.
     * <table>
     *  <tr><th>Pointer</th><td>Yes</td></tr>
     *  <tr><th>Value</th><td>No</td></tr>
     * </table>
     */
    export class SelectionIndividualRecord extends SelectionIndividualRecord_base {
        getName(): SelectionName;
        getSex(): SelectionSex;
        getFamilyAsChild(): SelectionFamilyRecord;
        getFamilyAsSpouse(): SelectionFamilyRecord;
        getEventBirth(): SelectionIndividualEventFamily;
        getEventChristening(): SelectionIndividualEventFamily;
        getEventDeath(): SelectionIndividualEvent;
        getEventBurial(): SelectionIndividualEvent;
        getEventCremation(): SelectionIndividualEvent;
        getEventAdoption(): SelectionIndividualEventFamilyAdoption;
        getEventBaptism(): SelectionIndividualEvent;
        getEventBarMitzvah(): SelectionIndividualEvent;
        getEventBatMitzvah(): SelectionIndividualEvent;
        getEventAdultChristening(): SelectionIndividualEvent;
        getEventConfirmation(): SelectionIndividualEvent;
        getEventFirstCommunion(): SelectionIndividualEvent;
        getEventNaturalization(): SelectionIndividualEvent;
        getEventEmigration(): SelectionIndividualEvent;
        getEventImmigration(): SelectionIndividualEvent;
        getEventCensus(): SelectionIndividualEvent;
        getEventProbate(): SelectionIndividualEvent;
        getEventWill(): SelectionIndividualEvent;
        getEventGraduation(): SelectionIndividualEvent;
        getEventRetirement(): SelectionIndividualEvent;
        getEventOther(): SelectionIndividualEvent;
        getAttributeCaste(): SelectionIndividualAttribute;
        getAttributePhysicalDescription(): SelectionIndividualAttribute;
        getAttributeScholasticAchievement(): SelectionIndividualAttribute;
        getAttributeIdentificationNumber(): SelectionIndividualAttribute;
        getAttributeNationality(): SelectionIndividualAttribute;
        getAttributeChildrenCount(): SelectionIndividualAttribute;
        getAttributeRelationshipCount(): SelectionIndividualAttribute;
        getAttributeOccupation(): SelectionIndividualAttribute;
        getAttributePossessions(): SelectionIndividualAttribute;
        getAttributeReligiousAffiliation(): SelectionIndividualAttribute;
        getAttributeResidence(): SelectionIndividualAttribute;
        getAttributeNobilityTitle(): SelectionIndividualAttribute;
        getAttributeFact(): SelectionIndividualAttribute;
        getChildFamilyLink(): SelectionChildFamilyLink;
        getSpouseFamilyLink(): SelectionSpouseFamilyLink;
        getAssociation(): SelectionAssociation;
    }
}
declare module "selection/SelectionIndividualReference" {
    import { SelectionReference } from "selection/internal";
    export class SelectionIndividualReference extends SelectionReference {
        getIndividualRecord(): import("selection/SelectionIndividualRecord").SelectionIndividualRecord;
    }
}
declare module "selection/SelectionLatitude" {
    import { SelectionAny } from "selection/internal";
    export class SelectionLatitude extends SelectionAny {
        valueAsLatitude(): (number | null)[];
    }
}
declare module "selection/SelectionLongitude" {
    import { SelectionAny } from "selection/internal";
    export class SelectionLongitude extends SelectionAny {
        valueAsLongitude(): (number | null)[];
    }
}
declare module "selection/SelectionMultimediaFile" {
    import { SelectionMultimediaFormat, SelectionAny } from "selection/internal";
    export class SelectionMultimediaFile extends SelectionAny {
        getFormat(): SelectionMultimediaFormat;
        getTitle(): SelectionAny;
    }
}
declare module "selection/SelectionMultimediaFormat" {
    import { SelectionMediaType, SelectionAny } from "selection/internal";
    export class SelectionMultimediaFormat extends SelectionAny {
        getMediaType(): SelectionMediaType;
    }
}
declare module "selection/SelectionMultimediaRecord" {
    import { SelectionMultimediaFile } from "selection/internal";
    import { SelectionRecord } from "selection/base/index";
    const SelectionMultimediaRecord_base: typeof SelectionRecord & import("meta").AnyConstructor<import("selection/mixin").SelectionWithSourceCitationMixin> & import("meta").AnyConstructor<import("selection/mixin").SelectionWithNoteMixin>;
    export class SelectionMultimediaRecord extends SelectionMultimediaRecord_base {
        getFileReference(): SelectionMultimediaFile;
    }
}
declare module "selection/SelectionMultimediaReference" {
    import { SelectionReference } from "selection/internal";
    export class SelectionMultimediaReference extends SelectionReference {
        getMultimediaRecord(): import("selection/SelectionMultimediaRecord").SelectionMultimediaRecord;
    }
}
declare module "selection/SelectionNamePhonetization" {
    import { SelectionPhonetizationMethod, SelectionNamePieces } from "selection/internal";
    export class SelectionNamePhonetization extends SelectionNamePieces {
        getMethod(): SelectionPhonetizationMethod;
    }
}
declare module "selection/SelectionNameRomanization" {
    import { SelectionRomanizationMethod, SelectionNamePieces } from "selection/internal";
    export class SelectionNameRomanization extends SelectionNamePieces {
        getMethod(): SelectionRomanizationMethod;
    }
}
declare module "selection/SelectionName" {
    import { SelectionNameType, SelectionNamePhonetization, SelectionNameRomanization, SelectionNamePieces } from "selection/internal";
    export class SelectionName extends SelectionNamePieces {
        valueAsParts(): (import("parse").ValueNameParts | null)[];
        getType(): SelectionNameType;
        getNamePhonetization(): SelectionNamePhonetization;
        getNameRomanization(): SelectionNameRomanization;
    }
}
declare module "selection/SelectionNoteRecord" {
    import { SelectionWithSourceCitationMixin } from "selection/mixin/index";
    import { SelectionRecord } from "selection/base/index";
    const SelectionNoteRecord_base: typeof SelectionRecord & import("meta").AnyConstructor<SelectionWithSourceCitationMixin>;
    export class SelectionNoteRecord extends SelectionNoteRecord_base {
    }
}
declare module "selection/SelectionNoteReferenceMixed" {
    import { SelectionAny } from "selection/internal";
    export class SelectionNoteReferenceMixed extends SelectionAny {
        getNoteRecord(): import("selection/SelectionNoteRecord").SelectionNoteRecord;
    }
}
declare module "selection/SelectionPhonetization" {
    import { SelectionPhonetizationMethod, SelectionAny } from "selection/internal";
    export class SelectionPhonetization extends SelectionAny {
        getMethod(): SelectionPhonetizationMethod;
    }
}
declare module "selection/SelectionPlace" {
    import { SelectionPhonetization, SelectionRomanization, SelectionCoordinates, SelectionAny } from "selection/internal";
    import { SelectionWithNoteMixin } from "selection/mixin/index";
    const SelectionPlace_base: typeof SelectionAny & import("meta").AnyConstructor<SelectionWithNoteMixin>;
    export class SelectionPlace extends SelectionPlace_base {
        valueAsParts(): (string[] | null)[];
        getPhonetization(): SelectionPhonetization;
        getRomanization(): SelectionRomanization;
        getCoordinates(): SelectionCoordinates;
    }
}
declare module "selection/SelectionReferenceNumber" {
    import { SelectionAny } from "selection/internal";
    export class SelectionReferenceNumber extends SelectionAny {
        getType(): SelectionAny;
    }
}
declare module "selection/SelectionRepositoryRecord" {
    import { SelectionWithAddressMixin } from "selection/internal";
    import { SelectionRecord } from "selection/base/index";
    import { SelectionWithNoteMixin } from "selection/mixin/index";
    const SelectionRepositoryRecord_base: typeof SelectionRecord & import("meta").AnyConstructor<SelectionWithNoteMixin> & import("meta").AnyConstructor<SelectionWithAddressMixin>;
    export class SelectionRepositoryRecord extends SelectionRepositoryRecord_base {
        getName(): import("selection/SelectionAny").SelectionAny;
    }
}
declare module "selection/SelectionRepositoryReference" {
    import { SelectionAny } from "selection/internal";
    export class SelectionRepositoryReference extends SelectionAny {
        getRepositoryRecord(): import("selection/SelectionRepositoryRecord").SelectionRepositoryRecord;
        getSourceCallNumber(): SelectionAny;
    }
}
declare module "selection/SelectionRomanization" {
    import { SelectionRomanizationMethod, SelectionAny } from "selection/internal";
    export class SelectionRomanization extends SelectionAny {
        getMethod(): SelectionRomanizationMethod;
    }
}
declare module "selection/SelectionSourceCitation" {
    import { SelectionCitationEvent, SelectionCitationData, SelectionSourceCertainty, SelectionAny, SelectionWithMultimediaMixin } from "selection/internal";
    import { SelectionWithNoteMixin } from "selection/mixin/index";
    const SelectionSourceCitation_base: typeof SelectionAny & import("meta").AnyConstructor<SelectionWithNoteMixin> & import("meta").AnyConstructor<SelectionWithMultimediaMixin>;
    export class SelectionSourceCitation extends SelectionSourceCitation_base {
        getSourceRecord(): import("selection/SelectionSourceRecord").SelectionSourceRecord;
        getLocationInSource(): SelectionAny;
        getEventCitedFrom(): SelectionCitationEvent;
        getData(): SelectionCitationData;
        getCertainty(): SelectionSourceCertainty;
    }
}
declare module "selection/SelectionSourceData" {
    import { SelectionEventsRecorded, SelectionAny } from "selection/internal";
    import { SelectionWithNoteMixin } from "selection/mixin/index";
    const SelectionSourceData_base: typeof SelectionAny & import("meta").AnyConstructor<SelectionWithNoteMixin>;
    export class SelectionSourceData extends SelectionSourceData_base {
        getEventsRecorded(): SelectionEventsRecorded;
        getResponsibleAgency(): SelectionAny;
    }
}
declare module "selection/SelectionSourceRecord" {
    import { SelectionSourceData, SelectionRepositoryReference, SelectionWithMultimediaMixin } from "selection/internal";
    import { SelectionRecord } from "selection/base/index";
    import { SelectionWithNoteMixin } from "selection/mixin/index";
    const SelectionSourceRecord_base: typeof SelectionRecord & import("meta").AnyConstructor<SelectionWithNoteMixin> & import("meta").AnyConstructor<SelectionWithMultimediaMixin>;
    export class SelectionSourceRecord extends SelectionSourceRecord_base {
        getData(): SelectionSourceData;
        getOriginator(): import("selection/SelectionAny").SelectionAny;
        getDescriptiveTitle(): import("selection/SelectionAny").SelectionAny;
        getShortTitle(): import("selection/SelectionAny").SelectionAny;
        getPublicationFacts(): import("selection/SelectionAny").SelectionAny;
        getText(): import("selection/SelectionAny").SelectionAny;
        getRepository(): SelectionRepositoryReference;
    }
}
declare module "selection/SelectionSpouseEventDetails" {
    import { SelectionAge, SelectionAny } from "selection/internal";
    export class SelectionSpouseEventDetails extends SelectionAny {
        getAge(): SelectionAge;
    }
}
declare module "selection/SelectionSpouseFamilyLink" {
    import { SelectionAny } from "selection/internal";
    import { SelectionWithNoteMixin } from "selection/mixin/index";
    const SelectionSpouseFamilyLink_base: typeof SelectionAny & import("meta").AnyConstructor<SelectionWithNoteMixin>;
    export class SelectionSpouseFamilyLink extends SelectionSpouseFamilyLink_base {
        getFamilyRecord(): import("selection/SelectionFamilyRecord").SelectionFamilyRecord;
    }
}
declare module "selection/SelectionSubmitterRecord" {
    import { SelectionRecord } from "selection/base/index";
    import { SelectionWithAddressMixin, SelectionWithMultimediaMixin, SelectionWithNoteMixin } from "selection/mixin/index";
    const SelectionSubmitterRecord_base: typeof SelectionRecord & import("meta").AnyConstructor<SelectionWithNoteMixin> & import("meta").AnyConstructor<SelectionWithAddressMixin> & import("meta").AnyConstructor<SelectionWithMultimediaMixin>;
    export class SelectionSubmitterRecord extends SelectionSubmitterRecord_base {
        getName(): import("selection").SelectionAny;
    }
}
declare module "selection/SelectionSubmitterReference" {
    import { SelectionReference } from "selection/internal";
    export class SelectionSubmitterReference extends SelectionReference {
        getSubmitterRecord(): import("selection/SelectionSubmitterRecord").SelectionSubmitterRecord;
    }
}
declare module "selection/SelectionTime" {
    import { SelectionAny } from "selection/internal";
    export class SelectionTime extends SelectionAny {
        valueAsExactTime(): (import("parse").ValueExactTime | null)[];
    }
}
declare module "selection/SelectionAdoption" {
    import { SelectionAny } from "selection/internal";
    export type SelectionAdoption = SelectionAny;
}
declare module "selection/SelectionCharacterEncoding" {
    import { SelectionAny } from "selection/internal";
    export type SelectionCharacterEncoding = SelectionAny;
}
declare module "selection/SelectionMediaType" {
    import { SelectionAny } from "selection/internal";
    export type SelectionMediaType = SelectionAny;
}
declare module "selection/SelectionNameType" {
    import { SelectionAny } from "selection/internal";
    export type SelectionNameType = SelectionAny;
}
declare module "selection/SelectionPedigreeLinkageType" {
    import { SelectionAny } from "selection/internal";
    export type SelectionPedigreeLinkageType = SelectionAny;
}
declare module "selection/SelectionPhonetizationMethod" {
    import { SelectionAny } from "selection/internal";
    export type SelectionPhonetizationMethod = SelectionAny;
}
declare module "selection/SelectionRomanizationMethod" {
    import { SelectionAny } from "selection/internal";
    export type SelectionRomanizationMethod = SelectionAny;
}
declare module "selection/SelectionSex" {
    import { SelectionAny } from "selection/internal";
    export type SelectionSex = SelectionAny;
}
declare module "selection/SelectionSourceCertainty" {
    import { SelectionAny } from "selection/internal";
    export type SelectionSourceCertainty = SelectionAny;
}
declare module "selection/internal" {
    export { SelectionAny } from "selection/SelectionAny";
    export * from "selection/base/index";
    export * from "selection/mixin/index";
    export { SelectionEvent } from "selection/SelectionEvent";
    export { SelectionNamePieces } from "selection/SelectionNamePieces";
    export { SelectionMetaEvent } from "selection/SelectionMetaEvent";
    export { SelectionDate } from "selection/SelectionDate";
    export { SelectionReference } from "selection/SelectionReference";
    export { SelectionFamilyReference } from "selection/SelectionFamilyReference";
    export { SelectionIndividualEvent } from "selection/SelectionIndividualEvent";
    export { SelectionAddress } from "selection/SelectionAddress";
    export { SelectionAge } from "selection/SelectionAge";
    export { SelectionAssociation } from "selection/SelectionAssociation";
    export { SelectionChanged } from "selection/SelectionChanged";
    export { SelectionChildFamilyLink } from "selection/SelectionChildFamilyLink";
    export { SelectionCitationData } from "selection/SelectionCitationData";
    export { SelectionCitationEvent } from "selection/SelectionCitationEvent";
    export { SelectionCoordinates } from "selection/SelectionCoordinates";
    export { SelectionCorporation } from "selection/SelectionCorporation";
    export { SelectionDataSource } from "selection/SelectionDataSource";
    export { SelectionDateExact } from "selection/SelectionDateExact";
    export { SelectionDatePeriod } from "selection/SelectionDatePeriod";
    export { SelectionDatePunctual } from "selection/SelectionDatePunctual";
    export { SelectionEventsRecorded } from "selection/SelectionEventsRecorded";
    export { SelectionFamilyEvent } from "selection/SelectionFamilyEvent";
    export { SelectionFamilyRecord } from "selection/SelectionFamilyRecord";
    export { SelectionFamilyReferenceAdoption } from "selection/SelectionFamilyReferenceAdoption";
    export { SelectionGedcomFile } from "selection/SelectionGedcomFile";
    export { SelectionGedcomForm } from "selection/SelectionGedcomForm";
    export { SelectionGedcomSource } from "selection/SelectionGedcomSource";
    export { SelectionGedcom } from "selection/SelectionGedcom";
    export { SelectionGedcomVersion } from "selection/SelectionGedcomVersion";
    export { SelectionHeader } from "selection/SelectionHeader";
    export { SelectionIndividualAttribute } from "selection/SelectionIndividualAttribute";
    export { SelectionIndividualEventFamilyAdoption } from "selection/SelectionIndividualEventFamilyAdoption";
    export { SelectionIndividualEventFamily } from "selection/SelectionIndividualEventFamily";
    export { SelectionIndividualRecord } from "selection/SelectionIndividualRecord";
    export { SelectionIndividualReference } from "selection/SelectionIndividualReference";
    export { SelectionLatitude } from "selection/SelectionLatitude";
    export { SelectionLongitude } from "selection/SelectionLongitude";
    export { SelectionMultimediaFile } from "selection/SelectionMultimediaFile";
    export { SelectionMultimediaFormat } from "selection/SelectionMultimediaFormat";
    export { SelectionMultimediaRecord } from "selection/SelectionMultimediaRecord";
    export { SelectionMultimediaReference } from "selection/SelectionMultimediaReference";
    export { SelectionNamePhonetization } from "selection/SelectionNamePhonetization";
    export { SelectionNameRomanization } from "selection/SelectionNameRomanization";
    export { SelectionName } from "selection/SelectionName";
    export { SelectionNoteRecord } from "selection/SelectionNoteRecord";
    export { SelectionNoteReferenceMixed } from "selection/SelectionNoteReferenceMixed";
    export { SelectionPhonetization } from "selection/SelectionPhonetization";
    export { SelectionPlace } from "selection/SelectionPlace";
    export { SelectionReferenceNumber } from "selection/SelectionReferenceNumber";
    export { SelectionRepositoryRecord } from "selection/SelectionRepositoryRecord";
    export { SelectionRepositoryReference } from "selection/SelectionRepositoryReference";
    export { SelectionRomanization } from "selection/SelectionRomanization";
    export { SelectionSourceCitation } from "selection/SelectionSourceCitation";
    export { SelectionSourceData } from "selection/SelectionSourceData";
    export { SelectionSourceRecord } from "selection/SelectionSourceRecord";
    export { SelectionSpouseEventDetails } from "selection/SelectionSpouseEventDetails";
    export { SelectionSpouseFamilyLink } from "selection/SelectionSpouseFamilyLink";
    export { SelectionSubmitterRecord } from "selection/SelectionSubmitterRecord";
    export { SelectionSubmitterReference } from "selection/SelectionSubmitterReference";
    export { SelectionTime } from "selection/SelectionTime";
    export { SelectionAdoption } from "selection/SelectionAdoption";
    export { SelectionCharacterEncoding } from "selection/SelectionCharacterEncoding";
    export { SelectionMediaType } from "selection/SelectionMediaType";
    export { SelectionNameType } from "selection/SelectionNameType";
    export { SelectionPedigreeLinkageType } from "selection/SelectionPedigreeLinkageType";
    export { SelectionPhonetizationMethod } from "selection/SelectionPhonetizationMethod";
    export { SelectionRomanizationMethod } from "selection/SelectionRomanizationMethod";
    export { SelectionSex } from "selection/SelectionSex";
    export { SelectionSourceCertainty } from "selection/SelectionSourceCertainty";
}
declare module "selection/read" {
    import { GedcomReadingOptions } from "parse/index";
    import { TreeNodeRoot } from "tree/index";
    import { SelectionGedcom } from "selection/internal";
    /**
     * Parses a Gedcom file with {@link parseGedcom} and wraps the result in a {@link SelectionGedcom}.
     * @param buffer The content of the file
     * @param options Optional parameters
     */
    export const readGedcom: (buffer: ArrayBuffer, options?: GedcomReadingOptions) => SelectionGedcom;
    /**
     * Wrap a Gedcom tree into a {@link SelectionGedcom}.
     * @param rootNode The Gedcom tree
     */
    export const selectGedcom: (rootNode: TreeNodeRoot) => SelectionGedcom;
}
declare module "selection/index" {
    /**
     * @module Selection
     */
    export { readGedcom, selectGedcom } from "selection/read";
    export * from "selection/internal";
}
declare module "index" {
    export * from "tree/index";
    export * from "selection/index";
    export * from "parse/index";
    export * from "tag/index";
    export * from "value/index";
}
