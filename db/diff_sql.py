import re

def get_tables(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(file_path, 'r', encoding='latin-1') as f:
            content = f.read()
    
    tables = {}
    pattern = re.compile(r'CREATE TABLE[^`]+`([^`]+)`(.*?)\n\n|CREATE TABLE.*?;', re.DOTALL | re.IGNORECASE)
    
    # A better pattern for mysqldump outputs:
    # They usually have CREATE TABLE `table_name` ( ... ) ENGINE=...;
    better_pattern = re.compile(r'CREATE TABLE `([^`]+)` \((.*?)\) ENGINE=[^;]+;', re.DOTALL)
    for match in better_pattern.finditer(content):
        table_name = match.group(1)
        schema = match.group(0)
        tables[table_name] = schema
    
    # Also grab ALTER TABLE statements for AUTO_INCREMENT etc.
    alters = re.findall(r'ALTER TABLE `([^`]+)`(.*?);', content, re.DOTALL)
    alter_dict = {}
    for table, alt in alters:
        if table not in alter_dict:
            alter_dict[table] = []
        alter_dict[table].append(alt.strip())
        
    return tables, alter_dict

local_tables, local_alters = get_tables(r"C:\Users\koush\Downloads\website (1)\website\db\gold2.sql")
server_tables, server_alters = get_tables(r"C:\Users\koush\Downloads\website (1)\website\db\foodplus_gold (1).sql")

print("==== MISSING TABLES ON SERVER ====")
for t in local_tables:
    if t not in server_tables:
        print(f"Table '{t}' is completely missing. Run this query:")
        print(local_tables[t])
        if t in local_alters:
            for alt in local_alters[t]:
                print(f"ALTER TABLE `{t}` {alt};")
        print("\n" + "-"*50 + "\n")

print("==== MISSING COLUMNS / SCHEMA DIFFERENCES ====")
for t in local_tables:
    if t in server_tables:
        loc_str = local_tables[t]
        srv_str = server_tables[t]
        
        loc_cols = re.findall(r'`([^`]+)`', loc_str.split('(', 1)[1])
        srv_cols = re.findall(r'`([^`]+)`', srv_str.split('(', 1)[1])
        
        missing_cols = [c for c in loc_cols if c not in srv_cols]
        if missing_cols:
            print(f"Table '{t}' is missing columns on Server: {missing_cols}")
            
print("==== MISSING ALTER STATEMENTS (Like AUTO_INCREMENT) ====")
for t in local_alters:
    loc_alts = local_alters[t]
    srv_alts = server_alters.get(t, [])
    
    for l_a in loc_alts:
        if l_a not in srv_alts:
            print(f"Missing ALTER on `{t}`: ALTER TABLE `{t}` {l_a};")

