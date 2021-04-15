
export enum EventStatus {
    Requesting = 'Requesting',
    Requested = 'Requested',
    Pending = 'Pending',
    Ready = 'Ready',
    Cueing = 'Cueing',
    Cued = 'Cued',
    Recording = 'Recording',
    Done = 'Done',
    Failed = 'Failed',
    Warning = 'Warning'
}

export enum EventType {
    Active = 'Active', 
    Inactive = 'Inactive',
    Reserved = 'Reserved' 
}

export enum EventHealth {
    Unknown = 'Unknown',
    Good = 'Good',
    Alert = 'Alert',
    Fatal = 'Fatal'
}

export enum EventHealthCondition {
    None = 'None',
    RECORD_DURATION_TRUNCATED = 'RECORD_DURATION_TRUNCATED',
    BNCS_UNKNOWN = 'BNCS_UNKNOWN',
    BNCS_HTTP400 = 'BNCS_HTTP400',
    BNCS_HTTP404 = 'BNCS_HTTP404'
}

export enum EventErrorReason {
    ERR_ATTRITBUTE_NOT_FOUND = 'ERR_ATTRITBUTE_NOT_FOUND',
    ERR_ATTRIBUTE_DENIED = 'ERR_ATTRIBUTE_DENIED',
    ERR_EVENT_CONFLICT = 'ERR_EVENT_CONFLICT',
    ERR_HEALTH = 'ERR_HEALTH'
}

export interface ISvcEvent {
    "event:id"?: string;
    "name:text"?: string;
    "referenceId:text"?: string;
    "start:dateTime"?: Date;
    "end:dateTime"?: Date;
    "source"?: { "channel:text": string, "recordId:text"?: string };
    "asset:id"?: string;
    "isCrash:bool"?: boolean;
    "status:enum"?: EventStatus;
    "health:enum"?: EventHealth;
    "healthCondition:enum" ?: EventHealthCondition[];
    "type:enum"?: EventType; 
    "folder:id"?: string;
}