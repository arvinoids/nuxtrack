/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Cases = "cases",
	Counter = "counter",
	Currentlist = "currentlist",
	Currentposition = "currentposition",
	Groups = "groups",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type CasesRecord = {
	user: RecordIdString
	group: RecordIdString
	case: string
	assignedBy?: string
}

export type CounterRecord = {
	user: RecordIdString
	group: RecordIdString
	count?: number
}

export type CurrentlistRecord = {
	user: RecordIdString
	group: RecordIdString
	count?: number
	order: number
}

export type CurrentpositionRecord = {
	group?: RecordIdString
	position: number
}

export type GroupsRecord = {
	name: string
	description?: string
	order?: number
}

export enum UsersRoleOptions {
	"user" = "user",
	"lead" = "lead",
	"admin" = "admin",
}
export type UsersRecord = {
	fullname?: string
	memberOf?: RecordIdString[]
	role: UsersRoleOptions
}

// Response types include system fields and match responses from the PocketBase API
export type CasesResponse<Texpand = unknown> = CasesRecord & BaseSystemFields<Texpand>
export type CounterResponse<Texpand = unknown> = CounterRecord & BaseSystemFields<Texpand>
export type CurrentlistResponse<Texpand = unknown> = CurrentlistRecord & BaseSystemFields<Texpand>
export type CurrentpositionResponse<Texpand = unknown> = CurrentpositionRecord & BaseSystemFields<Texpand>
export type GroupsResponse = GroupsRecord & BaseSystemFields
export type UsersResponse<Texpand = unknown> = UsersRecord & AuthSystemFields<Texpand>

export type CollectionRecords = {
	cases: CasesRecord
	counter: CounterRecord
	currentlist: CurrentlistRecord
	currentposition: CurrentpositionRecord
	groups: GroupsRecord
	users: UsersRecord
}