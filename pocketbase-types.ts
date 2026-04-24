/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export const Collections = {
	Authorigins: "_authOrigins",
	Externalauths: "_externalAuths",
	Mfas: "_mfas",
	Otps: "_otps",
	Superusers: "_superusers",
	Archive: "archive",
	Blobs: "blobs",
	Cases: "cases",
	Changelog: "changelog",
	Completion: "completion",
	Counter: "counter",
	Courses: "courses",
	Currentlist: "currentlist",
	Currentposition: "currentposition",
	Discovery: "discovery",
	Groups: "groups",
	Images: "images",
	Leaves: "leaves",
	Links: "links",
	Logs: "logs",
	Posts: "posts",
	Printers: "printers",
	Products: "products",
	Servers: "servers",
	Settings: "settings",
	Teams: "teams",
	Users: "users",
} as const
export type Collections = typeof Collections[keyof typeof Collections]

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
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
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type ArchiveRecord = {
	created: IsoAutoDateString
	description?: string
	file?: FileNameString
	id: string
	name?: string
	updated: IsoAutoDateString
}

export type BlobsRecord<Tdata = unknown> = {
	created: IsoAutoDateString
	data?: null | Tdata
	id: string
	name: string
	updated: IsoAutoDateString
}

export type CasesRecord = {
	assignedBy?: string
	case: string
	created: IsoAutoDateString
	group?: RecordIdString
	id: string
	updated: IsoAutoDateString
	user: RecordIdString
}

export type ChangelogRecord = {
	created: IsoAutoDateString
	description?: string
	id: string
	title?: string
	updated: IsoAutoDateString
	version?: string
}

export type CompletionRecord = {
	assigned_on: IsoDateString
	completed?: boolean
	completed_on?: IsoDateString
	course?: RecordIdString
	created: IsoAutoDateString
	id: string
	updated: IsoAutoDateString
	user?: RecordIdString
}

export type CounterRecord = {
	archived?: number
	count?: number
	created: IsoAutoDateString
	group: RecordIdString
	id: string
	total_count?: number
	updated: IsoAutoDateString
	user: RecordIdString
}

export type CoursesRecord = {
	created: IsoAutoDateString
	id: string
	teams?: RecordIdString[]
	title?: string
	updated: IsoAutoDateString
	url?: string
}

export type CurrentlistRecord = {
	count?: number
	created: IsoAutoDateString
	group: RecordIdString
	id: string
	order: number
	updated: IsoAutoDateString
	user: RecordIdString
}

export type CurrentpositionRecord = {
	created: IsoAutoDateString
	group?: RecordIdString
	id: string
	position: number
	updated: IsoAutoDateString
}

export type DiscoveryRecord = {
	created: IsoAutoDateString
	endIp: string
	id: string
	startIp: string
	updated: IsoAutoDateString
}

export type GroupsRecord = {
	created: IsoAutoDateString
	description?: string
	id: string
	is_l3?: boolean
	name: string
	order?: number
	updated: IsoAutoDateString
}

export type ImagesRecord = {
	created: IsoAutoDateString
	file?: FileNameString
	id: string
	updated: IsoAutoDateString
}

export const LeavesReasonOptions = {
	"On leave": "On leave",
	"Rest day": "Rest day",
} as const
export type LeavesReasonOptions = typeof LeavesReasonOptions[keyof typeof LeavesReasonOptions]
export type LeavesRecord = {
	active?: boolean
	created: IsoAutoDateString
	difference?: number
	group: RecordIdString
	id: string
	position?: number
	reason: LeavesReasonOptions
	total_cases: number
	updated: IsoAutoDateString
	user: RecordIdString
}

export type LinksRecord = {
	admin?: boolean
	created: IsoAutoDateString
	details?: string
	id: string
	title: string
	updated: IsoAutoDateString
	url: string
}

export const LogsTypeOptions = {
	"assigned case": "assigned case",
	"updated case": "updated case",
	"deleted case": "deleted case",
	"dismissed notification": "dismissed notification",
	"skipped user": "skipped user",
	"deleted user": "deleted user",
	"updated user": "updated user",
	"canceled assign": "canceled assign",
	"changed status": "changed status",
	"checked for new cases": "checked for new cases",
	"logged in": "logged in",
	"logged out": "logged out",
	"created group": "created group",
	"updated group": "updated group",
	"deleted group": "deleted group",
	"other": "other",
} as const
export type LogsTypeOptions = typeof LogsTypeOptions[keyof typeof LogsTypeOptions]
export type LogsRecord = {
	created: IsoAutoDateString
	debug?: boolean
	details?: string
	id: string
	type: LogsTypeOptions
	updated: IsoAutoDateString
	user: string
}

export const PostsTypeOptions = {
	"minutes": "minutes",
	"issue": "issue",
	"update": "update",
	"howto": "howto",
} as const
export type PostsTypeOptions = typeof PostsTypeOptions[keyof typeof PostsTypeOptions]

export const PostsStatusOptions = {
	"ongoing": "ongoing",
	"resolved": "resolved",
	"static": "static",
} as const
export type PostsStatusOptions = typeof PostsStatusOptions[keyof typeof PostsStatusOptions]

export const PostsVisibilityOptions = {
	"public": "public",
	"draft": "draft",
	"admins": "admins",
	"admin": "admin",
} as const
export type PostsVisibilityOptions = typeof PostsVisibilityOptions[keyof typeof PostsVisibilityOptions]
export type PostsRecord = {
	author: RecordIdString
	content?: HTMLString
	created: IsoAutoDateString
	document_id: string
	id: string
	link?: string
	pdf_file?: FileNameString
	pdf_text?: string
	pdf_text_rich?: HTMLString
	product: RecordIdString
	status: PostsStatusOptions
	title: string
	type: PostsTypeOptions
	updated: IsoAutoDateString
	visibility: PostsVisibilityOptions
}

export const PrintersStatusOptions = {
	"Online": "Online",
	"Offline": "Offline",
} as const
export type PrintersStatusOptions = typeof PrintersStatusOptions[keyof typeof PrintersStatusOptions]
export type PrintersRecord = {
	address: string
	contact?: string
	created: IsoAutoDateString
	firmware?: string
	hostname?: string
	id: string
	location?: string
	mac?: string
	model?: string
	serial?: string
	status?: PrintersStatusOptions
	updated: IsoAutoDateString
}

export type ProductsRecord = {
	created: IsoAutoDateString
	description?: string
	id: string
	name?: string
	updated: IsoAutoDateString
}

export const ServersTypeOptions = {
	"ldd": "ldd",
	"mve": "mve",
	"rdp": "rdp",
	"other": "other",
} as const
export type ServersTypeOptions = typeof ServersTypeOptions[keyof typeof ServersTypeOptions]
export type ServersRecord = {
	address: string
	apps?: string
	created: IsoAutoDateString
	credentials?: string
	id: string
	owner?: RecordIdString
	status?: string
	type?: ServersTypeOptions
	updated: IsoAutoDateString
}

export type SettingsRecord = {
	created: IsoAutoDateString
	field: string
	id: string
	updated: IsoAutoDateString
	value?: string
}

export type TeamsRecord = {
	created: IsoAutoDateString
	description?: string
	id: string
	name?: string
	updated: IsoAutoDateString
}

export const UsersRoleOptions = {
	"user": "user",
	"lead": "lead",
	"admin": "admin",
} as const
export type UsersRoleOptions = typeof UsersRoleOptions[keyof typeof UsersRoleOptions]

export const UsersStatusOptions = {
	"Available": "Available",
	"Busy": "Busy",
	"Outside shift": "Outside shift",
	"On leave": "On leave",
	"Not available": "Not available",
	"Rest day": "Rest day",
	"Unknown": "Unknown",
} as const
export type UsersStatusOptions = typeof UsersStatusOptions[keyof typeof UsersStatusOptions]

export const UsersPreviousStatusOptions = {
	"Available": "Available",
	"Busy": "Busy",
	"Rest day": "Rest day",
	"Outside shift": "Outside shift",
	"On leave": "On leave",
	"Not available": "Not available",
	"Unknown": "Unknown",
} as const
export type UsersPreviousStatusOptions = typeof UsersPreviousStatusOptions[keyof typeof UsersPreviousStatusOptions]
export type UsersRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
	email?: string
	emailVisibility?: boolean
	fullname?: string
	id: string
	memberOf?: RecordIdString[]
	password: string
	previous_status?: UsersPreviousStatusOptions
	role: UsersRoleOptions
	status?: UsersStatusOptions
	statusmessage?: string
	team?: RecordIdString
	tokenKey: string
	updated: IsoAutoDateString
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
export type BlobsResponse<Tdata = unknown, Texpand = unknown> = Required<BlobsRecord<Tdata>> & BaseSystemFields<Texpand>
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
	blobs: BlobsRecord
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
	blobs: BlobsResponse
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

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
