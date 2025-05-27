interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
}

// keep only some keys
type UserPreview = Pick<User, 'id' | 'name'>;

// every field optional
type PartialUser = Partial<User>;

// immutable view
type ReadonlyUser = Readonly<User>;

// usage examples
const _preview: UserPreview = { id: '42', name: 'Rosi' };
const _draft: PartialUser = { name: 'Draft Name' };
const _frozen: ReadonlyUser = {
  id: '1',
  name: 'Admin',
  email: 'admin@example.com',
  admin: true,
};
// frozen.name = 'oops'; //❌ cannot assign – readonly
