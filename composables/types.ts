declare module 'pocketbase-types'{
    interface user {
            "collectionId": string,
            "collectionName": string,
            "created": string,
            "emailVisibility": boolean,
            "fullname": string,
            "id": string,
            "memberOf": [],
            "role": string,
            "updated": Date,
            "username": string,
            "verified": boolean
        }
    
        interface expanded { 
            "collectionId": string,
            "collectionName": string,
            "count": number,
            "created": string,
            "expand": {
                "user": user
            },
            "group": string,
            "id": string,
            "order": number,
            "updated": Date,
            "user": string
        }

        interface expandedUsers {
                "page": number,
                "perPage": number,
                "totalItems": number,
                "totalPages": number,
                "items": expanded[]
        }
}

declare module 'custom-types' {
    interface LogData {
        user:string,
        type: "assigned case" | "updated case" | "deleted case" | "dismissed notification" |  "skipped user" | "deleted user" | "updated user",
        details?:string
      }

    interface userEntry {
        username: string,
        email: string,
        emailVisibility:boolean,
        password: string,
        passwordConfirm: string,
        fullname: string,
        memberOf: string[],
        role: "user" | "admin"
    }
      
}
