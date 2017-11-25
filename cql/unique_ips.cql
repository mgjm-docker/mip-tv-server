SELECT COUNT(*)
    FROM uniqueIps
    WHERE userid = ?
        AND day in ? // INPUT set/array
    GROUP BY (userid, day, time);
