-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Chintan Shah
-- Create date: 
-- Description:	
-- =============================================

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND OBJECT_ID = OBJECT_ID('dbo.GetInsertsByCreatedDateTime'))
BEGIN
	DROP PROCEDURE [dbo].[GetInsertsByCreatedDateTime]
END
GO

CREATE PROCEDURE GetInsertsByCreatedDateTime 
	-- Add the parameters for the stored procedure here
	@TableName nvarchar(500), 
	@LastCheckedDateTime datetime
AS
BEGIN
	Declare @SQLSTRING nvarchar(500)

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Select statements for procedure here
	IF (SELECT COUNT(*) FROM [dbo].[PayLoads]) = 0
	 BEGIN
		SET @SQLSTRING = N'SELECT * FROM ' + @TableName + ' WHERE CreatedDateTime < Convert(datetime,''' + Convert(nvarchar(500),@LastCheckedDateTime,126) + ''',126)'
	 END
	ELSE
	 BEGIN		
		DECLARE @LASTPAYLOADDATE DATETIME
		SELECT @LASTPAYLOADDATE = MAX(CreatedDateTime) FROM  [dbo].[PayLoads]
		SET @SQLSTRING = N'SELECT * FROM ' + @TableName + ' WHERE CreatedDateTime > Convert(datetime,''' + Convert(nvarchar(500),@LASTPAYLOADDATE,126) + ''',126) AND CreatedDateTime <= Convert(datetime,''' + Convert(nvarchar(500),@LastCheckedDateTime,126) +''',126)'
	 END
	
	EXECUTE sp_executesql @SQLSTRING;
END
GO
