import { table } from 'console';
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('meals', (table) => {
		table.uuid('id').primary();
		table.uuid('session_id').after('id').index();
		table.string('user_id').after('session_id').index().notNullable();
		table.text('name').notNullable();
		table.string('description').notNullable();
		table.timestamp('meal_date_time').notNullable();
		table.boolean('diet').notNullable();
		table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('meals');
}
