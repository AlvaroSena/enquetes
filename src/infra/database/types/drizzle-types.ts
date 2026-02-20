import { db } from '..'

export type DrizzleTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0]