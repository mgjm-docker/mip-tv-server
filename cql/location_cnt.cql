SELECT (location, cnt)
    FROM locations
    WHERE userid = ?
        AND day = ?;
