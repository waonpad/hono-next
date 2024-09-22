export type NoLeadingSlash<T extends string> = T extends `/${infer U}` ? U : T;
