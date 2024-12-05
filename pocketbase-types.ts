/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Cases = "cases",
	Changelog = "changelog",
	Counter = "counter",
	Currentposition = "currentposition",
	Groups = "groups",
	Leaves = "leaves",
	Links = "links",
	Logs = "logs",
	Others = "others",
	Settings = "settings",
	UnassignedCases = "unassigned_cases",
	Users = "users",
	Usersequence = "usersequence",
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
	assignedBy?: string
	case: string
	group?: RecordIdString
	user: RecordIdString
}

export type ChangelogRecord = {
	description?: string
	title?: string
	version?: string
}

export type CounterRecord = {
	count?: number
	group: RecordIdString
	user: RecordIdString
}

export type CurrentpositionRecord = {
	group?: RecordIdString
	position: number
}

export type GroupsRecord = {
	description?: string
	name: string
	order?: number
}

export type LeavesRecord = {
	active?: boolean
	difference?: number
	group: RecordIdString
	position?: number
	user: RecordIdString
}

export type LinksRecord = {
	title?: string
	url?: string
}

export enum LogsTypeOptions {
	"assigned case" = "assigned case",
	"updated case" = "updated case",
	"deleted case" = "deleted case",
	"dismissed notification" = "dismissed notification",
	"skipped user" = "skipped user",
	"deleted user" = "deleted user",
	"updated user" = "updated user",
	"canceled assign" = "canceled assign",
	"changed status" = "changed status",
	"checked for new cases" = "checked for new cases",
	"logged in" = "logged in",
	"logged out" = "logged out",
	"directly assigned" = "directly assigned",
	"clicked next host" = "clicked next host",
	"changed note" = "changed note",
	"advance assigned case" = "advance assigned case",
}
export type LogsRecord = {
	details?: string
	type: LogsTypeOptions
	user: string
}

export type OthersRecord = {
	item?: string
	value?: string
}

export type SettingsRecord = {
	field: string
	value: string
}

export type UnassignedCasesRecord = {
	caseId: string
	group?: RecordIdString
	user: RecordIdString
}

export enum UsersRoleOptions {
	"user" = "user",
	"lead" = "lead",
	"admin" = "admin",
}

export enum UsersStatusOptions {
	"Available" = "Available",
	"Busy" = "Busy",
	"Outside shift" = "Outside shift",
	"On leave" = "On leave",
	"Not available" = "Not available",
	"Unknown" = "Unknown",
}
export type UsersRecord = {
	avatar?: string
	cases?: number
	fullname?: string
	last_assigned?: IsoDateString
	last_assigned_previous?: IsoDateString
	memberOf?: RecordIdString[]
	role: UsersRoleOptions
	status?: UsersStatusOptions
	statusmessage?: string
}

export type UsersequenceRecord<Tuser_order = unknown> = {
	group: RecordIdString
	user_order?: null | Tuser_order
}

// Response types include system fields and match responses from the PocketBase API
export type CasesResponse<Texpand = unknown> = Required<CasesRecord> & BaseSystemFields<Texpand>
export type ChangelogResponse<Texpand = unknown> = Required<ChangelogRecord> & BaseSystemFields<Texpand>
export type CounterResponse<Texpand = unknown> = Required<CounterRecord> & BaseSystemFields<Texpand>
export type CurrentpositionResponse<Texpand = unknown> = Required<CurrentpositionRecord> & BaseSystemFields<Texpand>
export type GroupsResponse<Texpand = unknown> = Required<GroupsRecord> & BaseSystemFields<Texpand>
export type LeavesResponse<Texpand = unknown> = Required<LeavesRecord> & BaseSystemFields<Texpand>
export type LinksResponse<Texpand = unknown> = Required<LinksRecord> & BaseSystemFields<Texpand>
export type LogsResponse<Texpand = unknown> = Required<LogsRecord> & BaseSystemFields<Texpand>
export type OthersResponse<Texpand = unknown> = Required<OthersRecord> & BaseSystemFields<Texpand>
export type SettingsResponse<Texpand = unknown> = Required<SettingsRecord> & BaseSystemFields<Texpand>
export type UnassignedCasesResponse<Texpand = unknown> = Required<UnassignedCasesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type UsersequenceResponse<Tuser_order = unknown, Texpand = unknown> = Required<UsersequenceRecord<Tuser_order>> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	cases: CasesRecord
	changelog: ChangelogRecord
	counter: CounterRecord
	currentposition: CurrentpositionRecord
	groups: GroupsRecord
	leaves: LeavesRecord
	links: LinksRecord
	logs: LogsRecord
	others: OthersRecord
	settings: SettingsRecord
	unassigned_cases: UnassignedCasesRecord
	users: UsersRecord
	usersequence: UsersequenceRecord
}

export type CollectionResponses = {
	cases: CasesResponse
	changelog: ChangelogResponse
	counter: CounterResponse
	currentposition: CurrentpositionResponse
	groups: GroupsResponse
	leaves: LeavesResponse
	links: LinksResponse
	logs: LogsResponse
	others: OthersResponse
	settings: SettingsResponse
	unassigned_cases: UnassignedCasesResponse
	users: UsersResponse
	usersequence: UsersequenceResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'cases'): RecordService<CasesResponse>
	collection(idOrName: 'changelog'): RecordService<ChangelogResponse>
	collection(idOrName: 'counter'): RecordService<CounterResponse>
	collection(idOrName: 'currentposition'): RecordService<CurrentpositionResponse>
	collection(idOrName: 'groups'): RecordService<GroupsResponse>
	collection(idOrName: 'leaves'): RecordService<LeavesResponse>
	collection(idOrName: 'links'): RecordService<LinksResponse>
	collection(idOrName: 'logs'): RecordService<LogsResponse>
	collection(idOrName: 'others'): RecordService<OthersResponse>
	collection(idOrName: 'settings'): RecordService<SettingsResponse>
	collection(idOrName: 'unassigned_cases'): RecordService<UnassignedCasesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'usersequence'): RecordService<UsersequenceResponse>
}
