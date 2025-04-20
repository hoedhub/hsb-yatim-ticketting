// src/lib/db/schema.ts (Contoh struktur dasar, disesuaikan dengan klarifikasi)
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, primaryKey, real, index } from 'drizzle-orm/sqlite-core';

export const institutions = sqliteTable('institutions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    picName: text('pic_name'),
    contact: text('contact'),
    address: text('address'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
});

export const customers = sqliteTable('customers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    contact: text('contact'),
    address: text('address'),
    // isPersonal flag tidak terlalu relevan jika relasi many-to-many jelas
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
});

// Relasi Many-to-Many antara Customer dan Institution
export const customerToInstitution = sqliteTable('customer_to_institution', {
    customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }), // Cascade delete jika customer dihapus
    institutionId: integer('institution_id').notNull().references(() => institutions.id, { onDelete: 'cascade' }), // Cascade delete jika institusi dihapus
}, (t) => ({
    pk: primaryKey({ columns: [t.customerId, t.institutionId] }),
}));

export const garmentTypes = sqliteTable('garment_types', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
});

export const measurementPoints = sqliteTable('measurement_points', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    unit: text('unit').default('cm'),
});

export const measurementSets = sqliteTable('measurement_sets', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
    garmentTypeId: integer('garment_type_id').notNull().references(() => garmentTypes.id),
    label: text('label'),
    isArchived: integer('is_archived', { mode: 'boolean' }).default(false).notNull(), // Flag untuk arsip ukuran lama
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
}, (table) => ({
    customerIdx: index("measurement_set_customer_idx").on(table.customerId), // Index untuk query by customer
    activeIdx: index("measurement_set_active_idx").on(table.isArchived), // Index untuk query set aktif
}));

export const measurementDetails = sqliteTable('measurement_details', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    setId: integer('set_id').notNull().references(() => measurementSets.id, { onDelete: 'cascade' }), // Cascade jika set dihapus
    pointId: integer('point_id').notNull().references(() => measurementPoints.id),
    value: real('value').notNull(),
    label: text('label'),
});

export const orders = sqliteTable('orders', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderNumber: text('order_number').unique().notNull(), // Bisa diisi auto-increment atau custom
    customerId: integer('customer_id').references(() => customers.id, { onDelete: 'set null' }), // Boleh null jika pesanan institusi? Atau harus ada customer PIC? -> Tetap perlu PIC
    institutionId: integer('institution_id').references(() => institutions.id, { onDelete: 'set null' }), // Jika pesanan institusi
    orderDate: integer('order_date', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    dueDate: integer('due_date', { mode: 'timestamp_ms' }),
    notes: text('notes'),
    currentStatus: text('current_status').default('Baru Masuk').notNull(), // Status terakhir
    isPaid: integer('is_paid', { mode: 'boolean' }).default(false).notNull(), // Flag Lunas
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
}, (table) => ({
    statusIdx: index("order_status_idx").on(table.currentStatus),
    paidIdx: index("order_paid_idx").on(table.isPaid),
}));

export const orderItems = sqliteTable('order_items', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }), // Cascade jika order dihapus
    // Pelanggan spesifik untuk item ini (terutama penting untuk pesanan institusi)
    customerId: integer('customer_id').notNull().references(() => customers.id),
    measurementSetId: integer('measurement_set_id').notNull().references(() => measurementSets.id), // Ukuran yang digunakan
    quantity: integer('quantity').default(1).notNull(),
    material: text('material'),
    color: text('color'),
    itemNotes: text('item_notes'),
    ticketPrintedAt: integer('ticket_printed_at', { mode: 'timestamp_ms' }),
}, (table) => ({
    orderIdx: index("order_item_order_idx").on(table.orderId),
    customerIdx: index("order_item_customer_idx").on(table.customerId), // Memudahkan cari item milik customer X
}));

export const orderStatusHistory = sqliteTable('order_status_history', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    // orderItemId: integer('order_item_id').references(() => orderItems.id), // Opsional jika status per item
    status: text('status').notNull(),
    changedAt: integer('changed_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    // userId: integer('user_id'), // Dihilangkan untuk MVP
    notes: text('notes'),
}, (table) => ({
    orderIdx: index("order_history_order_idx").on(table.orderId),
}));

// Tabel untuk menyimpan konfigurasi layout tiket
export const ticketLayouts = sqliteTable('ticket_layouts', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(), // Nama layout, misal 'Layout Kemeja A4', 'Layout Celana Detail'
    config: text('config', { mode: 'json' }).notNull(), // Menyimpan struktur grid, mapping cell (JSON)
    isDefault: integer('is_default', { mode: 'boolean' }).default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
});

// Relasi (Contoh dasar, perlu dilengkapi)
export const customersRelations = relations(customers, ({ many }) => ({
    measurementSets: many(measurementSets),
    orders: many(orders), // Orders dimana customer ini jadi PIC
    orderItems: many(orderItems), // Item spesifik milik customer ini
    customerToInstitutions: many(customerToInstitution),
}));

export const institutionsRelations = relations(institutions, ({ many }) => ({
    orders: many(orders), // Orders yg terkait institusi ini
    customerToInstitutions: many(customerToInstitution),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
    institution: one(institutions, { fields: [orders.institutionId], references: [institutions.id] }),
    items: many(orderItems),
    statusHistory: many(orderStatusHistory),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
    customer: one(customers, { fields: [orderItems.customerId], references: [customers.id] }),
    measurementSet: one(measurementSets, { fields: [orderItems.measurementSetId], references: [measurementSets.id] }),
}));

// ... definisikan relasi lainnya ...