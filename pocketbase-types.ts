/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Archive = "archive",
	Cases = "cases",
	Changelog = "changelog",
	Completion = "completion",
	Counter = "counter",
	Courses = "courses",
	Currentlist = "currentlist",
	Currentposition = "currentposition",
	Groups = "groups",
	Leaves = "leaves",
	Logs = "logs",
	Posts = "posts",
	Printers = "printers",
	Products = "products",
	Servers = "servers",
	Settings = "settings",
	Teams = "teams",
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

export type ArchiveRecord = {
	description?: string
	file?: string
	name?: string
}

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

export type CompletionRecord = {
	assigned_on: IsoDateString
	completed?: boolean
	completed_on?: IsoDateString
	course?: RecordIdString
	user?: RecordIdString
}

export type CounterRecord = {
	count?: number
	group: RecordIdString
	user: RecordIdString
}

export type CoursesRecord = {
	teams?: RecordIdString[]
	title?: string
	url?: string
}

export type CurrentlistRecord = {
	count?: number
	group: RecordIdString
	order: number
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
}
export type LogsRecord = {
	details?: string
	type: LogsTypeOptions
	user: string
}

export enum PostsTypeOptions {
	"minutes" = "minutes",
	"issue" = "issue",
	"update" = "update",
	"howto" = "howto",
}

export enum PostsStatusOptions {
	"ongoing" = "ongoing",
	"resolved" = "resolved",
	"static" = "static",
}

export enum PostsVisibilityOptions {
	"public" = "public",
	"draft" = "draft",
	"admin" = "admin",
}
export type PostsRecord = {
	author: RecordIdString
	content?: HTMLString
	document_id: string
	link?: string
	product: RecordIdString
	status: PostsStatusOptions
	title: string
	type: PostsTypeOptions
	visibility: PostsVisibilityOptions
}

export enum PrintersStatusOptions {
	"Online" = "Online",
	"Offline" = "Offline",
}
export type PrintersRecord = {
	address: string
	contact?: string
	firmware?: string
	hostname?: string
	location?: string
	mac?: string
	model?: string
	serial?: string
	status?: PrintersStatusOptions
}

export type ProductsRecord = {
	description?: string
	name?: string
}

export enum ServersTypeOptions {
	"ldd" = "ldd",
	"mve" = "mve",
	"rdp" = "rdp",
	"other" = "other",
}
export type ServersRecord = {
	address?: string
	apps?: string
	status?: string
	type?: ServersTypeOptions
}

export type SettingsRecord = {
	field: string
	value?: string
}

export type TeamsRecord = {
	description?: string
	name?: string
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
	"Rest day" = "Rest day",
	"Not available" = "Not available",
	"Unknown" = "Unknown",
}
export type UsersRecord = {
	avatar?: string
	fullname?: string
	memberOf?: RecordIdString[]
	role: UsersRoleOptions
	status?: UsersStatusOptions
	statusmessage?: string
	team?: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type ArchiveResponse<Texpand = unknown> = Required<ArchiveRecord> & BaseSystemFields<Texpand>
export type CasesResponse<Texpand = unknown> = Required<CasesRecord> & BaseSystemFields<Texpand>
export type ChangelogResponse<Texpand = unknown> = Required<ChangelogRecord> & BaseSystemFields<Texpand>
export type CompletionResponse<Texpand = unknown> = Required<CompletionRecord> & BaseSystemFields<Texpand>
export type CounterResponse<Texpand = unknown> = Required<CounterRecord> & BaseSystemFields<Texpand>
export type CoursesResponse<Texpand = unknown> = Required<CoursesRecord> & BaseSystemFields<Texpand>
export type CurrentlistResponse<Texpand = unknown> = Required<CurrentlistRecord> & BaseSystemFields<Texpand>
export type CurrentpositionResponse<Texpand = unknown> = Required<CurrentpositionRecord> & BaseSystemFields<Texpand>
export type GroupsResponse<Texpand = unknown> = Required<GroupsRecord> & BaseSystemFields<Texpand>
export type LeavesResponse<Texpand = unknown> = Required<LeavesRecord> & BaseSystemFields<Texpand>
export type LogsResponse<Texpand = unknown> = Required<LogsRecord> & BaseSystemFields<Texpand>
export type PostsResponse<Texpand = unknown> = Required<PostsRecord> & BaseSystemFields<Texpand>
export type PrintersResponse<Texpand = unknown> = Required<PrintersRecord> & BaseSystemFields<Texpand>
export type ProductsResponse<Texpand = unknown> = Required<ProductsRecord> & BaseSystemFields<Texpand>
export type ServersResponse<Texpand = unknown> = Required<ServersRecord> & BaseSystemFields<Texpand>
export type SettingsResponse<Texpand = unknown> = Required<SettingsRecord> & BaseSystemFields<Texpand>
export type TeamsResponse<Texpand = unknown> = Required<TeamsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	archive: ArchiveRecord
	cases: CasesRecord
	changelog: ChangelogRecord
	completion: CompletionRecord
	counter: CounterRecord
	courses: CoursesRecord
	currentlist: CurrentlistRecord
	currentposition: CurrentpositionRecord
	groups: GroupsRecord
	leaves: LeavesRecord
	logs: LogsRecord
	posts: PostsRecord
	printers: PrintersRecord
	products: ProductsRecord
	servers: ServersRecord
	settings: SettingsRecord
	teams: TeamsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	archive: ArchiveResponse
	cases: CasesResponse
	changelog: ChangelogResponse
	completion: CompletionResponse
	counter: CounterResponse
	courses: CoursesResponse
	currentlist: CurrentlistResponse
	currentposition: CurrentpositionResponse
	groups: GroupsResponse
	leaves: LeavesResponse
	logs: LogsResponse
	posts: PostsResponse
	printers: PrintersResponse
	products: ProductsResponse
	servers: ServersResponse
	settings: SettingsResponse
	teams: TeamsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'archive'): RecordService<ArchiveResponse>
	collection(idOrName: 'cases'): RecordService<CasesResponse>
	collection(idOrName: 'changelog'): RecordService<ChangelogResponse>
	collection(idOrName: 'completion'): RecordService<CompletionResponse>
	collection(idOrName: 'counter'): RecordService<CounterResponse>
	collection(idOrName: 'courses'): RecordService<CoursesResponse>
	collection(idOrName: 'currentlist'): RecordService<CurrentlistResponse>
	collection(idOrName: 'currentposition'): RecordService<CurrentpositionResponse>
	collection(idOrName: 'groups'): RecordService<GroupsResponse>
	collection(idOrName: 'leaves'): RecordService<LeavesResponse>
	collection(idOrName: 'logs'): RecordService<LogsResponse>
	collection(idOrName: 'posts'): RecordService<PostsResponse>
	collection(idOrName: 'printers'): RecordService<PrintersResponse>
	collection(idOrName: 'products'): RecordService<ProductsResponse>
	collection(idOrName: 'servers'): RecordService<ServersResponse>
	collection(idOrName: 'settings'): RecordService<SettingsResponse>
	collection(idOrName: 'teams'): RecordService<TeamsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
