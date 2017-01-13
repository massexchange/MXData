dumpnamer - a simple/quick db dump renaming script Frank and Rob turded out one Friday morning.

What does it do?

Quite simply, it takes in a folder-style SQL db dump, and makes a copy of it with all of the table
files pointing to a new database name.

Why?

This helps to facilitate testing multiple issues which may require a different database schema than what is
currently in production. This allows us to switch databases out by simply changing the name in our 
backend properties source, rather than having to resort to time consuming loading/unloading/dropping of
databases for testing.

How to invoke:

First, use npm install to get any required libraries (minimist.)

Then: node index.js --src [Source Directory] --dest [Destination, will be created] --targetdb [Name to rename to]
Where:

--dest and --src are full paths on the file system (Shell variables and things like "~/" are allowed)
--targetdb must be a string

--src MUST exist and be a dump folder of db table data.


--dest MUST NOT exist already

Note: Not much thought went into error detection, and the promise usage definitely is NOT best practice, so
try to use the right inputs.
