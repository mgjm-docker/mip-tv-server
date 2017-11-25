SELECT (ip, country, loc, ts, uri)
    FROM rawdata
    WHERE userId = ?
    LIMIT 1000;
