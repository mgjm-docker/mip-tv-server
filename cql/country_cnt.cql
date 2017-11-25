SELECT (country, cnt)
    FROM countries
    WHERE userid = ?
    ORDER BY cnt DESC
    LIMIT 20;
