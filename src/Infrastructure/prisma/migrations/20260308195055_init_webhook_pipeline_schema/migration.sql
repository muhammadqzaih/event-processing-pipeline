BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[pipelines] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [webhook_key] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [pipelines_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [pipelines_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [pipelines_webhook_key_key] UNIQUE NONCLUSTERED ([webhook_key])
);

-- CreateTable
CREATE TABLE [dbo].[actions] (
    [id] NVARCHAR(1000) NOT NULL,
    [pipeline_id] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [config] NVARCHAR(1000) NOT NULL,
    [order] INT NOT NULL CONSTRAINT [actions_order_df] DEFAULT 0,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [actions_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [actions_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[subscribers] (
    [id] NVARCHAR(1000) NOT NULL,
    [pipeline_id] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [subscribers_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [subscribers_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[jobs] (
    [id] NVARCHAR(1000) NOT NULL,
    [pipeline_id] NVARCHAR(1000) NOT NULL,
    [payload] NVARCHAR(1000) NOT NULL,
    [result] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [jobs_status_df] DEFAULT 'pending',
    [created_at] DATETIME2 NOT NULL CONSTRAINT [jobs_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [jobs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[job_deliveries] (
    [id] NVARCHAR(1000) NOT NULL,
    [job_id] NVARCHAR(1000) NOT NULL,
    [subscriber_id] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [job_deliveries_status_df] DEFAULT 'pending',
    [attempt_count] INT NOT NULL CONSTRAINT [job_deliveries_attempt_count_df] DEFAULT 0,
    [last_attempt] DATETIME2,
    [response_status] INT,
    [response_body] NVARCHAR(1000),
    [created_at] DATETIME2 NOT NULL CONSTRAINT [job_deliveries_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [job_deliveries_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [actions_pipeline_id_idx] ON [dbo].[actions]([pipeline_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [subscribers_pipeline_id_idx] ON [dbo].[subscribers]([pipeline_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [jobs_pipeline_id_idx] ON [dbo].[jobs]([pipeline_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [jobs_status_idx] ON [dbo].[jobs]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [job_deliveries_job_id_idx] ON [dbo].[job_deliveries]([job_id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [job_deliveries_subscriber_id_idx] ON [dbo].[job_deliveries]([subscriber_id]);

-- AddForeignKey
ALTER TABLE [dbo].[actions] ADD CONSTRAINT [actions_pipeline_id_fkey] FOREIGN KEY ([pipeline_id]) REFERENCES [dbo].[pipelines]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[subscribers] ADD CONSTRAINT [subscribers_pipeline_id_fkey] FOREIGN KEY ([pipeline_id]) REFERENCES [dbo].[pipelines]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[jobs] ADD CONSTRAINT [jobs_pipeline_id_fkey] FOREIGN KEY ([pipeline_id]) REFERENCES [dbo].[pipelines]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[job_deliveries] ADD CONSTRAINT [job_deliveries_job_id_fkey] FOREIGN KEY ([job_id]) REFERENCES [dbo].[jobs]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[job_deliveries] ADD CONSTRAINT [job_deliveries_subscriber_id_fkey] FOREIGN KEY ([subscriber_id]) REFERENCES [dbo].[subscribers]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
