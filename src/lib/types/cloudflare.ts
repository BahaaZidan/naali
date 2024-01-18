export type Result<T = unknown> = {
	errors: unknown[];
	messages: unknown[];
	result?: T | null;
	success: boolean;
};

export type VideoDetails = {
	allowedOrigins: string[];
	created: string;
	creator: string;
	duration: number;
	input: Input;
	liveInput: string;
	maxDurationSeconds: number;
	meta: Meta;
	modified: string;
	playback: Playback;
	preview: string;
	readyToStream: boolean;
	readyToStreamAt: string;
	requireSignedURLs: boolean;
	scheduledDeletion: string;
	size: number;
	status: Status;
	thumbnail: string;
	thumbnailTimestampPct: number;
	uid: string;
	uploadExpiry: string;
	uploaded: string;
	watermark: Watermark;
};

export type Input = {
	height: number;
	width: number;
};

export type Meta = {
	name: string;
};

export type Playback = {
	dash: string;
	hls: string;
};

export type Status = {
	errorReasonCode: string;
	errorReasonText: string;
	pctComplete: string;
	state: 'pendingupload' | 'downloading' | 'queued' | 'inprogress' | 'ready' | 'error';
};

export type Watermark = {
	created: string;
	downloadedFrom: string;
	height: number;
	name: string;
	opacity: number;
	padding: number;
	position: string;
	scale: number;
	size: number;
	uid: string;
	width: number;
};
