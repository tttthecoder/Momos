import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1731472017063 implements MigrationInterface {
    name = 'Migrations1731472017063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_account_id\` bigint NOT NULL, \`type\` enum ('REFRESH_TOKEN', 'ACCESS_TOKEN') NOT NULL DEFAULT 'ACCESS_TOKEN', \`token\` varchar(2048) NULL, \`expired_at\` datetime NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_account\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`uuid\` varchar(36) NOT NULL, \`email\` varchar(255) NULL, \`password_hash\` varchar(250) NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_tokens\` ADD CONSTRAINT \`FK_4a05de82b55d230ff2f0edf1bba\` FOREIGN KEY (\`user_account_id\`) REFERENCES \`user_account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_tokens\` DROP FOREIGN KEY \`FK_4a05de82b55d230ff2f0edf1bba\``);
        await queryRunner.query(`DROP TABLE \`user_account\``);
        await queryRunner.query(`DROP TABLE \`user_tokens\``);
    }

}
