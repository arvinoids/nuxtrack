/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Archive = "archive",
	Cases = "cases",
	Changelog = "changelog",
	Completion = "completion",
	Counter = "counter",
	Courses = "courses",
	Currentlist = "currentlist",
	Currentposition = "currentposition",
	Discovery = "discovery",
	Groups = "groups",
	Images = "images",
	Leaves = "leaves",
	Links = "links",
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

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type ArchiveRecord = {
	created?: IsoDateString
	description?: string
	file?: string
	id: string
	name?: string
	updated?: IsoDateString
}

export type CasesRecord = {
	assignedBy?: string
	case: string
	created?: IsoDateString
	group?: RecordIdString
	id: string
	updated?: IsoDateString
	user: RecordIdString
}

export type ChangelogRecord = {
	created?: IsoDateString
	description?: string
	id: string
	title?: string
	updated?: IsoDateString
	version?: string
}

export type CompletionRecord = {
	assigned_on: IsoDateString
	completed?: boolean
	completed_on?: IsoDateString
	course?: RecordIdString
	created?: IsoDateString
	id: string
	updated?: IsoDateString
	user?: RecordIdString
}

export type CounterRecord = {
	archived?: number
	count?: number
	created?: IsoDateString
	group: RecordIdString
	id: string
	total_count?: number
	updated?: IsoDateString
	user: RecordIdString
}

export type CoursesRecord = {
	created?: IsoDateString
	id: string
	teams?: RecordIdString[]
	title?: string
	updated?: IsoDateString
	url?: string
}

export type CurrentlistRecord = {
	count?: number
	created?: IsoDateString
	group: RecordIdString
	id: string
	order: number
	updated?: IsoDateString
	user: RecordIdString
}

export type CurrentpositionRecord = {
	created?: IsoDateString
	group?: RecordIdString
	id: string
	position: number
	updated?: IsoDateString
}

export type DiscoveryRecord = {
	created?: IsoDateString
	endIp: string
	id: string
	startIp: string
	updated?: IsoDateString
}

export type GroupsRecord = {
	created?: IsoDateString
	description?: string
	id: string
	name: string
	is_l3: boolean
	order?: number
	updated?: IsoDateString
}

export type ImagesRecord = {
	created?: IsoDateString
	file?: string
	id: string
	updated?: IsoDateString
}

export enum LeavesReasonOptions {
	"On leave" = "On leave",
	"Rest day" = "Rest day",
}
export type LeavesRecord = {
	active?: boolean
	created?: IsoDateString
	difference?: number
	group: RecordIdString
	id: string
	position?: number
	reason: LeavesReasonOptions
	total_cases: number
	updated?: IsoDateString
	user: RecordIdString
}

export type LinksRecord = {
	admin?: boolean
	created?: IsoDateString
	details?: string
	id: string
	title: string
	updated?: IsoDateString
	url: string
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
	"other" = "other"
}
export type LogsRecord = {
	created?: IsoDateString
	details?: string
	id: string
	type: LogsTypeOptions
	debug?:boolean
	updated?: IsoDateString
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
	"admins" = "admins",
	"admin" = "admin",
}
export type PostsRecord = {
	author: RecordIdString
	content?: HTMLString
	created?: IsoDateString
	document_id: string
	id: string
	link?: string
	pdf_file?: string
	pdf_text?: string
	pdf_text_rich?: HTMLString
	product: RecordIdString
	status: PostsStatusOptions
	title: string
	type: PostsTypeOptions
	updated?: IsoDateString
	visibility: PostsVisibilityOptions
}

export enum PrintersStatusOptions {
	"Online" = "Online",
	"Offline" = "Offline",
}
export type PrintersRecord = {
	address: string
	contact?: string
	created?: IsoDateString
	firmware?: string
	hostname?: string
	id: string
	location?: string
	mac?: string
	model?: string
	serial?: string
	status?: PrintersStatusOptions
	updated?: IsoDateString
}

export type ProductsRecord = {
	created?: IsoDateString
	description?: string
	id: string
	name?: string
	updated?: IsoDateString
}

export enum ServersTypeOptions {
	"ldd" = "ldd",
	"mve" = "mve",
	"rdp" = "rdp",
	"other" = "other",
}
export type ServersRecord = {
	address: string
	apps?: string
	created?: IsoDateString
	id: string
	status?: string
	type?: ServersTypeOptions
	updated?: IsoDateString
}

export type SettingsRecord = {
	created?: IsoDateString
	field: string
	id: string
	updated?: IsoDateString
	value?: string
}

export type TeamsRecord = {
	created?: IsoDateString
	description?: string
	id: string
	name?: string
	updated?: IsoDateString
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
	"Rest day" = "Rest day",
	"Unknown" = "Unknown",
}
export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email?: string
	emailVisibility?: boolean
	fullname?: string
	id: string
	memberOf?: RecordIdString[]
	password: string
	role: UsersRoleOptions
	status?: UsersStatusOptions
	statusmessage?: string
	team?: RecordIdString
	tokenKey: string
	updated?: IsoDateString
	username: string
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ArchiveResponse<Texpand = unknown> = Required<ArchiveRecord> & BaseSystemFields<Texpand>
export type CasesResponse<Texpand = unknown> = Required<CasesRecord> & BaseSystemFields<Texpand>
export type ChangelogResponse<Texpand = unknown> = Required<ChangelogRecord> & BaseSystemFields<Texpand>
export type CompletionResponse<Texpand = unknown> = Required<CompletionRecord> & BaseSystemFields<Texpand>
export type CounterResponse<Texpand = unknown> = Required<CounterRecord> & BaseSystemFields<Texpand>
export type CoursesResponse<Texpand = unknown> = Required<CoursesRecord> & BaseSystemFields<Texpand>
export type CurrentlistResponse<Texpand = unknown> = Required<CurrentlistRecord> & BaseSystemFields<Texpand>
export type CurrentpositionResponse<Texpand = unknown> = Required<CurrentpositionRecord> & BaseSystemFields<Texpand>
export type DiscoveryResponse<Texpand = unknown> = Required<DiscoveryRecord> & BaseSystemFields<Texpand>
export type GroupsResponse<Texpand = unknown> = Required<GroupsRecord> & BaseSystemFields<Texpand>
export type ImagesResponse<Texpand = unknown> = Required<ImagesRecord> & BaseSystemFields<Texpand>
export type LeavesResponse<Texpand = unknown> = Required<LeavesRecord> & BaseSystemFields<Texpand>
export type LinksResponse<Texpand = unknown> = Required<LinksRecord> & BaseSystemFields<Texpand>
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
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	archive: ArchiveRecord
	cases: CasesRecord
	changelog: ChangelogRecord
	completion: CompletionRecord
	counter: CounterRecord
	courses: CoursesRecord
	currentlist: CurrentlistRecord
	currentposition: CurrentpositionRecord
	discovery: DiscoveryRecord
	groups: GroupsRecord
	images: ImagesRecord
	leaves: LeavesRecord
	links: LinksRecord
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
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	archive: ArchiveResponse
	cases: CasesResponse
	changelog: ChangelogResponse
	completion: CompletionResponse
	counter: CounterResponse
	courses: CoursesResponse
	currentlist: CurrentlistResponse
	currentposition: CurrentpositionResponse
	discovery: DiscoveryResponse
	groups: GroupsResponse
	images: ImagesResponse
	leaves: LeavesResponse
	links: LinksResponse
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
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'archive'): RecordService<ArchiveResponse>
	collection(idOrName: 'cases'): RecordService<CasesResponse>
	collection(idOrName: 'changelog'): RecordService<ChangelogResponse>
	collection(idOrName: 'completion'): RecordService<CompletionResponse>
	collection(idOrName: 'counter'): RecordService<CounterResponse>
	collection(idOrName: 'courses'): RecordService<CoursesResponse>
	collection(idOrName: 'currentlist'): RecordService<CurrentlistResponse>
	collection(idOrName: 'currentposition'): RecordService<CurrentpositionResponse>
	collection(idOrName: 'discovery'): RecordService<DiscoveryResponse>
	collection(idOrName: 'groups'): RecordService<GroupsResponse>
	collection(idOrName: 'images'): RecordService<ImagesResponse>
	collection(idOrName: 'leaves'): RecordService<LeavesResponse>
	collection(idOrName: 'links'): RecordService<LinksResponse>
	collection(idOrName: 'logs'): RecordService<LogsResponse>
	collection(idOrName: 'posts'): RecordService<PostsResponse>
	collection(idOrName: 'printers'): RecordService<PrintersResponse>
	collection(idOrName: 'products'): RecordService<ProductsResponse>
	collection(idOrName: 'servers'): RecordService<ServersResponse>
	collection(idOrName: 'settings'): RecordService<SettingsResponse>
	collection(idOrName: 'teams'): RecordService<TeamsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
