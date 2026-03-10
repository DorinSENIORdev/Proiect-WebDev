USE [EasySell];
GO

DECLARE @UserId INT = (
  SELECT TOP (1) id
  FROM dbo.Users
  WHERE [name] = N'Dorin Betivu'
  ORDER BY id
);

IF @UserId IS NULL
BEGIN
  THROW 50001, 'User "Dorin Betivu" nu exista in dbo.Users.', 1;
END;

DECLARE @Categories TABLE (
  category NVARCHAR(120) NOT NULL,
  titlePrefix NVARCHAR(150) NOT NULL,
  descPrefix NVARCHAR(400) NOT NULL,
  minPrice INT NOT NULL,
  maxPrice INT NOT NULL
);

INSERT INTO @Categories (category, titlePrefix, descPrefix, minPrice, maxPrice)
VALUES
  (N'Auto & Moto', N'Auto in stare foarte buna', N'Masina intretinuta, acte in regula, accept verificare service.', 2500, 15000),
  (N'Imobiliare', N'Apartament disponibil imediat', N'Locuinta luminoasa, zona buna, se poate vedea oricand.', 18000, 90000),
  (N'Electronice', N'Gadget aproape nou', N'Dispozitiv testat, functioneaza impecabil, predare personala.', 300, 5500),
  (N'Casa & Gradina', N'Produs util pentru casa', N'Calitate buna, fara defecte, ideal pentru uz zilnic.', 120, 4200),
  (N'Moda', N'Articol vestimentar modern', N'Purtat putin, marime corecta, arata foarte bine.', 80, 1200),
  (N'Sport & Hobby', N'Echipament sportiv pregatit de folosire', N'Bun pentru antrenament, stare foarte buna.', 150, 2500),
  (N'Copii', N'Produs pentru copii in stare excelenta', N'Curat, sigur, folosit putin, potrivit pentru familie.', 90, 1800),
  (N'Animale', N'Accesoriu pentru animale', N'Practic si rezistent, folosit minim, disponibil imediat.', 70, 900);

DECLARE @Cities TABLE (city NVARCHAR(120) NOT NULL);
INSERT INTO @Cities (city)
VALUES
  (N'Balti'),
  (N'Chisinau'),
  (N'Cahul'),
  (N'Orhei'),
  (N'Soroca'),
  (N'Ungheni'),
  (N'Comrat'),
  (N'Edinet');

DECLARE
  @Category NVARCHAR(120),
  @TitlePrefix NVARCHAR(150),
  @DescPrefix NVARCHAR(400),
  @MinPrice INT,
  @MaxPrice INT,
  @ExistingCount INT,
  @ToInsert INT,
  @Index INT,
  @Price DECIMAL(12,2),
  @City NVARCHAR(120);

DECLARE cat_cursor CURSOR FAST_FORWARD FOR
  SELECT category, titlePrefix, descPrefix, minPrice, maxPrice
  FROM @Categories;

OPEN cat_cursor;

FETCH NEXT FROM cat_cursor INTO @Category, @TitlePrefix, @DescPrefix, @MinPrice, @MaxPrice;

WHILE @@FETCH_STATUS = 0
BEGIN
  SELECT @ExistingCount = COUNT(*)
  FROM dbo.Announcements
  WHERE userId = @UserId
    AND category = @Category;

  SET @ToInsert = CASE WHEN @ExistingCount < 10 THEN 10 - @ExistingCount ELSE 0 END;
  SET @Index = @ExistingCount + 1;

  WHILE @ToInsert > 0
  BEGIN
    SELECT TOP (1) @City = city FROM @Cities ORDER BY NEWID();
    SET @Price = @MinPrice + ABS(CHECKSUM(NEWID())) % (@MaxPrice - @MinPrice + 1);

    INSERT INTO dbo.Announcements (
      userId, title, price, category, location, contact, description, imageUrl
    )
    VALUES (
      @UserId,
      CONCAT(@TitlePrefix, N' #', @Index),
      @Price,
      @Category,
      @City,
      N'Dorin Betivu',
      CONCAT(@DescPrefix, N' Anunt demo importat pentru proiect. Ref ', @Category, N'-', @Index, N'.'),
      N''
    );

    SET @ToInsert = @ToInsert - 1;
    SET @Index = @Index + 1;
  END;

  FETCH NEXT FROM cat_cursor INTO @Category, @TitlePrefix, @DescPrefix, @MinPrice, @MaxPrice;
END;

CLOSE cat_cursor;
DEALLOCATE cat_cursor;
GO
