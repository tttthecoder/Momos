import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1731640496335 implements MigrationInterface {
    name = 'Migrations1731640496335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`media\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`uuid\` varchar(36) NOT NULL, \`discription\` varchar(1000) NULL, \`type\` enum ('IMAGE', 'VIDEO') NOT NULL, \`url\` varchar(255) NOT NULL, \`site_url\` varchar(255) NOT NULL, \`title\` varchar(255) NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, FULLTEXT INDEX \`IDX_media_title_description_fulltext\` (\`title\`, \`discription\`), INDEX \`IDX_media_site_url_type\` (\`site_url\`, \`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_media_site_url_type\` ON \`media\``);
        await queryRunner.query(`DROP INDEX \`IDX_media_title_description_fulltext\` ON \`media\``);
        await queryRunner.query(`DROP TABLE \`media\``);
    }

}
