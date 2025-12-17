import json
import os
from pathlib import Path

cache_dir = Path("data/dashboard-cache")
months = ['2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11']

# Load all monthly data
monthly_data = {}
for month in months:
    file_path = cache_dir / month / "all__all__all.json"
    if file_path.exists():
        with open(file_path, 'r') as f:
            monthly_data[month] = json.load(f)
            print(f"Loaded {month}")

# Extract unique player counts by brand group, currency, brand
def get_player_data(data):
    players = {}
    for group in data['groups']:
        brand_group = group['brandGroup']
        if brand_group not in players:
            players[brand_group] = {}
        
        # Store brand group level
        if 'uniquePlayer' in group['metrics']:
            players[brand_group]['__total__'] = {
                'uniquePlayer': group['metrics']['uniquePlayer'],
                'ftdPlayer': group['metrics'].get('ftdPlayer', 0)
            }
        
        # Store currency level
        for curr in group.get('currencies', []):
            currency = curr['currency']
            if currency not in players[brand_group]:
                players[brand_group][currency] = {}
            
            if 'uniquePlayer' in curr['metrics']:
                players[brand_group][currency]['__total__'] = {
                    'uniquePlayer': curr['metrics']['uniquePlayer'],
                    'ftdPlayer': curr['metrics'].get('ftdPlayer', 0)
                }
            
            # Store brand level
            for brand in curr.get('brands', []):
                brand_name = brand['brand']
                players[brand_group][currency][brand_name] = {
                    'uniquePlayer': brand['metrics']['uniquePlayer'],
                    'ftdPlayer': brand['metrics'].get('ftdPlayer', 0)
                }
    
    return players

# Get player data for each month
players_by_month = {}
for month in months:
    if month in monthly_data:
        players_by_month[month] = get_player_data(monthly_data[month])

# Calculate retention rate
def calc_retention_rate(current_month, prev_month, brand_group, currency=None, brand=None):
    if prev_month not in players_by_month or current_month not in players_by_month:
        return None
    
    prev_players = players_by_month[prev_month]
    curr_players = players_by_month[current_month]
    
    try:
        if currency is None:
            # Brand group level
            prev_unique = prev_players.get(brand_group, {}).get('__total__', {}).get('uniquePlayer')
            curr_unique = curr_players.get(brand_group, {}).get('__total__', {}).get('uniquePlayer')
            curr_ftd = curr_players.get(brand_group, {}).get('__total__', {}).get('ftdPlayer')
        elif brand is None:
            # Currency level
            prev_unique = prev_players.get(brand_group, {}).get(currency, {}).get('__total__', {}).get('uniquePlayer')
            curr_unique = curr_players.get(brand_group, {}).get(currency, {}).get('__total__', {}).get('uniquePlayer')
            curr_ftd = curr_players.get(brand_group, {}).get(currency, {}).get('__total__', {}).get('ftdPlayer')
        else:
            # Brand level
            prev_unique = prev_players.get(brand_group, {}).get(currency, {}).get(brand, {}).get('uniquePlayer')
            curr_unique = curr_players.get(brand_group, {}).get(currency, {}).get(brand, {}).get('uniquePlayer')
            curr_ftd = curr_players.get(brand_group, {}).get(currency, {}).get(brand, {}).get('ftdPlayer')
    except:
        return None
    
    if not prev_unique or prev_unique == 0 or not curr_unique or curr_ftd is None:
        return None
    
    retained = curr_unique - curr_ftd
    retention_rate = (retained / prev_unique) * 100
    
    return retention_rate if retention_rate == retention_rate else None  # Check for NaN

# Update retention rates
for idx, month in enumerate(months):
    if month not in monthly_data:
        continue
    
    prev_month = months[idx - 1] if idx > 0 else None
    data = monthly_data[month]
    
    for group in data['groups']:
        brand_group = group['brandGroup']
        
        # Update brand group level
        if prev_month:
            group['metrics']['retentionRate'] = calc_retention_rate(month, prev_month, brand_group)
        else:
            group['metrics']['retentionRate'] = None
        
        # Update currency level
        for curr in group.get('currencies', []):
            currency = curr['currency']
            
            if prev_month:
                curr['metrics']['retentionRate'] = calc_retention_rate(month, prev_month, brand_group, currency)
            else:
                curr['metrics']['retentionRate'] = None
            
            # Update brand level
            for brand in curr.get('brands', []):
                brand_name = brand['brand']
                
                if prev_month:
                    brand['metrics']['retentionRate'] = calc_retention_rate(month, prev_month, brand_group, currency, brand_name)
                else:
                    brand['metrics']['retentionRate'] = None
    
    # Write updated file
    file_path = cache_dir / month / "all__all__all.json"
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f"Updated {month}")

print("\nRetention rates recalculated for all months!")
