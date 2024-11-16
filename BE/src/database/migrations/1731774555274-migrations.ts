import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1731774555274 implements MigrationInterface {
    name = 'Migrations1731774555274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_media_title_description_fulltext\` ON \`media\``);
        await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`discription\``);
        await queryRunner.query(`ALTER TABLE \`media\` ADD \`discription\` varchar(2000) NULL`);
        await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`media\` ADD \`title\` varchar(2000) NULL`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_media_title_description_fulltext\` ON \`media\` (\`title\`, \`discription\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_media_title_description_fulltext\` ON \`media\``);
        await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`media\` ADD \`title\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`discription\``);
        await queryRunner.query(`ALTER TABLE \`media\` ADD \`discription\` varchar(1000) NULL`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_media_title_description_fulltext\` ON \`media\` (\`title\`, \`discription\`)`);
    }

}
