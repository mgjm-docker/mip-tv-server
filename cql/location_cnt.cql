SELECT (location, day, cnt)
    FROM locations
    WHERE userid = ?
        AND day = ?;
