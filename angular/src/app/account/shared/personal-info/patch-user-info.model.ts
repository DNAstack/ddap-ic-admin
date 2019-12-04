// EXAMPLE:
// {"schemas":["urn:ietf:params:scim:api:messages:2.0:PatchOp"],"Operations":[{"op":"replace","path":"name.formatted","value":"Non-Administrator"},{"op":"replace","path":"active","value":"false"}]}

export interface PatchUserInfo {
  schemas: string[]
  Operations: [{
    op: PatchOperation,
    path: string,
    value: string,
  }];
}

export enum PatchOperation {
  add = 'add',
  replace = 'replace',
  remove = 'remove',
}
