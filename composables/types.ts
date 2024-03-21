
declare module 'pocketbase-types' {
    type user = {
        "collectionId": string,
        "collectionName": string,
        "created": Date,
        "emailVisibility": boolean,
        "fullname": string,
        "id": string,
        "memberOf": string[],
        "role": string,
        "updated": Date,
        "username": string,
        "verified": boolean,
        "status": string,
        "statusmessage": string,
    }

    type group = {
        "collectionId": string,
        "collectionName": string,
        "created": Date,
        "description": string,
        "id": string,
        "name": string,
        "order": number,
        "updated": Date
    }

    type expanded = {
        "collectionId": string,
        "collectionName": string,
        "count": number,
        "created": Date,
        "expand": {
            "user": user
        },
        "group": string,
        "id": string,
        "order": number,
        "updated": Date,
        "user": string,
        "status": string,
        "statusmessage": string,
    }

    type expandedUsers = {
        "page": number,
        "perPage": number,
        "totalItems": number,
        "totalPages": number,
        "items": expanded[]
    }
    type expandedCase = {
        "assignedBy": string,
        "case": string,
        "collectionId": string,
        "collectionName": string,
        "created": Date,
        "expand": {
            "group": group,
            "user": user
        },
        "group": string,
        "id": string,
        "updated": Date,
        "user": string
    }

    type expandedCaseRecordList = {
        "page": number,
        "perPage": number,
        "totalItems": number,
        "totalPages": number,
        "items": expandedCase[]
    }

    type counter = {
        "id": string,
        "user": string,
        "group": string,
        "count":number
    }

    type expandedCounter = counter& {
        "expand":{
            "user":user
        }
     }
}

declare module 'custom-types' {

    interface result {
        message:string,
        status:"success"|"failed"
    }
    interface LogData {
        user: string,
        type: "assigned case" | "updated case" | "deleted case" | "dismissed notification" | "skipped user" | "deleted user" | "updated user"|"changed status"|"canceled assign"|"checked for new cases"|"logged in"|"logged out",
        details?: string
    }

    interface userEntry {
        username: string,
        email: string,
        emailVisibility: boolean,
        password: string,
        passwordConfirm: string,
        fullname: string,
        memberOf: string[],
        role: "user" | "admin"|"lead",
        status?: statuschoice,
        statusmessage?: string,
    }

    interface emailContent {
        to: string,
        subject: string,
        body: string,
      }

    type statuschoice =  'Available'|'Busy'|'Outside shift'|'On leave'|'Not available'|'Unknown'

    interface userStatus {
        status:statuschoice,
        message:string
    }

    type notification = {
        status:'success'|'failed'|'warning',
        message:string,
    }
}