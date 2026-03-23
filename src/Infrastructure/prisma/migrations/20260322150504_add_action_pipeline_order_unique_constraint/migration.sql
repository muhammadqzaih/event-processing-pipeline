BEGIN TRY

BEGIN TRAN;

-- CreateIndex
CREATE UNIQUE NONCLUSTERED INDEX [actions_pipeline_id_order_key] ON [dbo].[actions]([pipeline_id], [order]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
