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
