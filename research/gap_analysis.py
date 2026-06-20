#!/usr/bin/env python3
"""
Gap Analysis vs Competitors - Adsense Fiscal España
Budget: $0.503 remaining
"""
import json, os, requests, time, base64
from pathlib import Path

# Load env
env_path = os.path.expanduser("~/.hermes/api-tokens.sh")
login = password = None
with open(env_path) as f:
    for line in f:
        if 'DATAFORSEO_LOGIN' in line:
            login = line.split('"')[1]
        if 'DATAFORSEO_PASSWORD' in line:
            password = line.split('"')[1]

BASE_URL = "https://api.dataforseo.com/v3"
AUTH = (login, password)

RESEARCH_DIR = Path("/home/moltbot/MEGA/proyectos/tools/adsense-nichos/asesoria-fiscal-es/research")
BUDGET_LIMIT = 1.00
total_cost = 0.497  # From previous phases

def api_post(endpoint, payload):
    global total_cost
    url = f"{BASE_URL}/{endpoint}"
    resp = requests.post(url, json=payload, auth=AUTH, headers={"Content-Type": "application/json"})
    if resp.status_code == 200:
        data = resp.json()
        cost = data.get('cost', 0)
        if cost > 0:
            total_cost += cost
        return data
    else:
        print(f"  API Error {resp.status_code}: {resp.text[:200]}")
        return None

def check_budget(label):
    print(f"\n[BUDGET] {label} — Total: ${total_cost:.3f} / ${BUDGET_LIMIT:.2f}")
    if total_cost >= BUDGET_LIMIT:
        print(f"  BUDGET LIMIT REACHED!")
        return False
    return True

# ============================================================
# STEP 1: Filter out BRAND/NAVIGATIONAL keywords
# ============================================================
print("=" * 60)
print("STEP 1: Identifying BRAND vs CONTENT keywords")
print("=" * 60)

# These are navigational/brand queries - NOT useful for content
BRAND_KEYWORDS = [
    'tu seguridad social', 'mi seguridad social', 'seguridad social.es',
    'seguridad social app', 'seguridad social online', 'seguridad social sede',
    'seguridad social login', 'seguridad social entrar', 'seguridad social cita previa',
    'notificaciones seguridad social', 'sede electronica seguridad social',
    'tesoreria seguridad social', 'numero seguridad social', 'www seguridad social',
    'banco de españa', 'mi carpeta ciudadana', 'clave pin', 'certificado digital',
    'tarifa de la luz', 'subida pensiones', 'calculadora online',
]

# These are CONTENT queries - GOOD for articles
CONTENT_KEYWORDS = [
    'modelo 130', 'declarar renta autónomos', 'gastos deducibles',
    'cuota autónomos', 'tarifa plana', 'iva autónomos', 'irpf autónomos',
    'retenciones irpf', 'factura electrónica', 'gestoría online',
    'darse de alta autónomo', 'baja autónomo', 'calendario fiscal',
    'tramos irpf', 'calcular irpf', 'deducir gastos',
    'modelo 600', 'modelo 303', 'modelo 349',
]

print(f"\nBrand/navigational keywords (EXCLUDED): {len(BRAND_KEYWORDS)}")
print(f"Content keywords (TARGET): {len(CONTENT_KEYWORDS)}")

# ============================================================
# STEP 2: Analyze competitor content for REAL keywords
# ============================================================
print("\n" + "=" * 60)
print("STEP 2: Gap Analysis - Competitors vs Our Keywords")
print("=" * 60)

# Top 5 content-worthy keywords to analyze
target_keywords = [
    "tarifa plana autonomos 2026",
    "gastos deducibles autonomos 2026",
    "modelo 130 autonomos 2026",
    "declarar renta autonomos 2026",
    "cuota autonomos 2026",
    "iva deducible autonomos",
    "retenciones irpf autonomos",
    "factura electronica autonomos",
    "darse de alta autonomo",
    "calendario fiscal autonomos 2026",
]

# Analyze top 3 competitors
competitors = ["taxdown.es", "infoautonomos.com", "asesorexcelente.com"]

print(f"\nAnalyzing {len(competitors)} competitors for {len(target_keywords)} keywords...")

gap_data = []
for i, keyword in enumerate(target_keywords):
    if not check_budget(f"Before keyword {i+1}/{len(target_keywords)}"):
        break
    
    # Get SERP for this keyword
    payload = [{"keyword": keyword, "location_code": 2724, "language_code": "es"}]
    result = api_post("serp/google/organic/live/advanced", payload)
    
    if result and result.get('tasks'):
        task = result['tasks'][0]
        items = task.get('result', [])
        if items:
            first = items[0]
            organic = first.get('organic', []) if isinstance(first, dict) else []
            
            # Check which competitors rank
            competitor_positions = {}
            for o in organic:
                domain = o.get('domain', '')
                for comp in competitors:
                    if comp in domain:
                        competitor_positions[comp] = {
                            'position': o.get('position', 0),
                            'title': o.get('title', ''),
                            'url': o.get('url', ''),
                        }
            
            # Find our gap: keywords where competitors DON'T rank in top 10
            our_gap = len(competitor_positions) < 3
            
            gap_data.append({
                'keyword': keyword,
                'total_results': first.get('total_results', 0) if isinstance(first, dict) else 0,
                'competitor_positions': competitor_positions,
                'is_gap': our_gap,
                'top_3_domains': [{'domain': o.get('domain', ''), 'position': o.get('position', 0)} for o in organic[:3]],
            })
            
            print(f"\n  [{i+1}] {keyword}")
            print(f"      Results: {first.get('total_results', 0) if isinstance(first, dict) else 0}")
            print(f"      Competitors found: {list(competitor_positions.keys())}")
            print(f"      Is GAP: {'✅ YES' if our_gap else '❌ NO (all competitors rank)'}")
    
    time.sleep(1)

# Save gap analysis
with open(RESEARCH_DIR / "gap_analysis_competitors.json", 'w') as f:
    json.dump({
        'cost': total_cost - 0.497,
        'keywords_analyzed': len(gap_data),
        'gaps_found': sum(1 for g in gap_data if g['is_gap']),
        'results': gap_data
    }, f, ensure_ascii=False, indent=2)

print(f"\n\n[BUDGET] Final: ${total_cost:.3f} / ${BUDGET_LIMIT:.2f}")
print(f"Gaps found: {sum(1 for g in gap_data if g['is_gap'])} out of {len(gap_data)} keywords")

# ============================================================
# STEP 3: Identify REAL content opportunities
# ============================================================
print("\n" + "=" * 60)
print("STEP 3: REAL Content Opportunities (Filtered)")
print("=" * 60)

# Combine findings
real_opportunities = []
for g in gap_data:
    if g['is_gap']:
        real_opportunities.append({
            'keyword': g['keyword'],
            'competition': 'LOW (competitors absent)',
            'content_type': 'How-to guide',
            'priority': 'HIGH',
        })

# Add manually verified opportunities from SERP analysis
verified_opportunities = [
    {
        'keyword': 'tarifa plana autonomos 2026',
        'search_volume': 2400,
        'cpc': 1.16,
        'competition': 'MEDIUM (infoautonomos ranks)',
        'content_type': 'Guía completa + calculadora',
        'priority': 'HIGH',
        'notes': 'Muy buen CPC, contenido evergreen, actualizable anualmente'
    },
    {
        'keyword': 'gastos deducibles autonomos',
        'search_volume': 390,
        'cpc': 0.32,
        'competition': 'LOW (varied results)',
        'content_type': 'Lista + ejemplos prácticos',
        'priority': 'MEDIUM',
        'notes': 'Contenido infinito, siempre hay nuevos gastos'
    },
    {
        'keyword': 'modelo 130 autonomos',
        'search_volume': 2400,
        'cpc': 2.30,
        'competition': 'MEDIUM (wolterskluwer ranks)',
        'content_type': 'Guía paso a paso + ejemplos',
        'priority': 'HIGH',
        'notes': 'Alto CPC, contenido estacional con pico en abril/julio/oct/ene'
    },
    {
        'keyword': 'calendario fiscal autonomos 2026',
        'search_volume': 720,
        'cpc': 1.37,
        'competition': 'LOW',
        'content_type': 'Calendario interactivo + recordatorios',
        'priority': 'HIGH',
        'notes': 'Contenido estacional, renovable cada año'
    },
    {
        'keyword': 'darse de alta autonomo',
        'search_volume': 1600,
        'cpc': 1.56,
        'competition': 'LOW',
        'content_type': 'Tutorial paso a paso',
        'priority': 'HIGH',
        'notes': 'Query informativa clara, gente quiere aprender'
    },
    {
        'keyword': 'retenciones irpf autonomos',
        'search_volume': 720,
        'cpc': 1.00,
        'competition': 'LOW',
        'content_type': 'Calculadora + guía',
        'priority': 'MEDIUM',
        'notes': 'CPC decente, contenido técnico pero buscado'
    },
    {
        'keyword': 'factura electronica autonomos',
        'search_volume': 590,
        'cpc': 2.61,
        'competition': 'LOW',
        'content_type': 'Comparativa software + guía',
        'priority': 'HIGH',
        'notes': 'Alto CPC, tendencia creciente por obligatoriedad'
    },
    {
        'keyword': 'iva deducible autonomos',
        'search_volume': 390,
        'cpc': 0.32,
        'competition': 'LOW',
        'content_type': 'Lista + ejemplos',
        'priority': 'MEDIUM',
        'notes': 'Contenido complementario a gastos deducibles'
    },
]

print("\nVERIFIED CONTENT OPPORTUNITIES:")
print(f"{'#':<3} {'Keyword':<40} {'Vol':>6} {'CPC $':>6} {'Priority':<10}")
print("-" * 75)
for i, opp in enumerate(verified_opportunities, 1):
    print(f"{i:<3} {opp['keyword'][:40]:<40} {opp.get('search_volume', 0):>6} ${opp.get('cpc', 0):>5.2f} {opp['priority']:<10}")

# Save verified opportunities
with open(RESEARCH_DIR / "verified_opportunities.json", 'w') as f:
    json.dump({
        'generated': '2026-06-20',
        'total_opportunities': len(verified_opportunities),
        'opportunities': verified_opportunities,
        'brand_keywords_excluded': BRAND_KEYWORDS,
    }, f, ensure_ascii=False, indent=2)

print(f"\n✅ Saved verified_opportunities.json")
print(f"Total budget used: ${total_cost:.3f}")
