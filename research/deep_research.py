#!/usr/bin/env python3
"""
Deep Research Phase - Adsense Fiscal España
Budget tracking: stop at $1.00
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

total_cost = 0.405  # Phase A-D already done

def api_post(endpoint, payload):
    global total_cost
    url = f"{BASE_URL}/{endpoint}"
    resp = requests.post(url, json=payload, auth=AUTH, headers={"Content-Type": "application/json"})
    if resp.status_code == 200:
        data = resp.json()
        cost = data.get('cost', 0)
        if cost > 0:
            total_cost += cost
        tasks = data.get('tasks', [])
        for t in tasks:
            tcost = t.get('cost', 0)
            if tcost > 0 and cost == 0:
                total_cost += tcost
        return data
    else:
        print(f"  API Error {resp.status_code}: {resp.text[:300]}")
        return None

def check_budget(label):
    print(f"\n[BUDGET] {label} — Total: ${total_cost:.3f} / ${BUDGET_LIMIT:.2f}")
    if total_cost >= BUDGET_LIMIT:
        print(f"  BUDGET LIMIT REACHED! Stopping at ${total_cost:.3f}")
        return False
    return True

# ============================================================
# PHASE B1: Long-tail for Modelo 130 (TOP PRIORITY)
# ============================================================
print("=" * 60)
print("PHASE B1: Long-tail Modelo 130 cluster")
print("=" * 60)

if not check_budget("Before B1"):
    exit(0)

payload_b1 = [{
    "keywords": ["modelo 130", "declarar modelo 130", "modelo 130 aeat"],
    "location_code": 2724,
    "language_code": "es",
    "limit": 100,
    "include_serp_info": True
}]

result_b1 = api_post("dataforseo_labs/keyword_ideas/live", payload_b1)
kws_b1 = []
if result_b1 and result_b1.get('tasks'):
    for task in result_b1['tasks']:
        items = task.get('result', [])
        if items:
            kws_b1 = items[0].get('items', [])
            print(f"  Found {len(kws_b1)} keyword ideas")
            for kw in kws_b1[:10]:
                ki = kw.get('keyword_info', {})
                print(f"  - {kw.get('keyword', 'N/A')}: vol={ki.get('search_volume', 0)}, cpc=${ki.get('cpc', 0) or 0:.2f}, comp={ki.get('competition', 0) or 0}")
else:
    print("  No results for B1")

with open(RESEARCH_DIR / "phase_b1_modelo130.json", 'w') as f:
    json.dump({"cost": total_cost - 0.405, "count": len(kws_b1), "results": kws_b1[:100]}, f, ensure_ascii=False, indent=2)

if not check_budget("After B1"):
    exit(0)

time.sleep(1)

# ============================================================
# PHASE B2: Long-tail for Cuota Autónomos
# ============================================================
print("\n" + "=" * 60)
print("PHASE B2: Long-tail Cuota Autónomos cluster")
print("=" * 60)

payload_b2 = [{
    "keywords": ["cuota autónomos", "tarifa plana autónomos", "seguridad social autónomo"],
    "location_code": 2724,
    "language_code": "es",
    "limit": 100,
    "include_serp_info": True
}]

result_b2 = api_post("dataforseo_labs/keyword_ideas/live", payload_b2)
kws_b2 = []
if result_b2 and result_b2.get('tasks'):
    for task in result_b2['tasks']:
        items = task.get('result', [])
        if items:
            kws_b2 = items[0].get('items', [])
            print(f"  Found {len(kws_b2)} keyword ideas")
            for kw in kws_b2[:10]:
                ki = kw.get('keyword_info', {})
                print(f"  - {kw.get('keyword', 'N/A')}: vol={ki.get('search_volume', 0)}, cpc=${ki.get('cpc', 0) or 0:.2f}")
else:
    print("  No results for B2")

with open(RESEARCH_DIR / "phase_b2_cuota_autonomos.json", 'w') as f:
    json.dump({"cost": total_cost - 0.405, "count": len(kws_b2), "results": kws_b2[:100]}, f, ensure_ascii=False, indent=2)

if not check_budget("After B2"):
    exit(0)

time.sleep(1)

# ============================================================
# PHASE B3: Long-tail for IVA Autónomos
# ============================================================
print("\n" + "=" * 60)
print("PHASE B3: Long-tail IVA Autónomos cluster")
print("=" * 60)

payload_b3 = [{
    "keywords": ["iva autónomos", "iva deducible", "declaración iva autónomos"],
    "location_code": 2724,
    "language_code": "es",
    "limit": 100,
    "include_serp_info": True
}]

result_b3 = api_post("dataforseo_labs/keyword_ideas/live", payload_b3)
kws_b3 = []
if result_b3 and result_b3.get('tasks'):
    for task in result_b3['tasks']:
        items = task.get('result', [])
        if items:
            kws_b3 = items[0].get('items', [])
            print(f"  Found {len(kws_b3)} keyword ideas")
            for kw in kws_b3[:10]:
                ki = kw.get('keyword_info', {})
                print(f"  - {kw.get('keyword', 'N/A')}: vol={ki.get('search_volume', 0)}, cpc=${ki.get('cpc', 0) or 0:.2f}")
else:
    print("  No results for B3")

with open(RESEARCH_DIR / "phase_b3_iva_autonomos.json", 'w') as f:
    json.dump({"cost": total_cost - 0.405, "count": len(kws_b3), "results": kws_b3[:100]}, f, ensure_ascii=False, indent=2)

if not check_budget("After B3"):
    exit(0)

time.sleep(1)

# ============================================================
# PHASE B4: Long-tail for Gestoría / Asesoría
# ============================================================
print("\n" + "=" * 60)
print("PHASE B4: Long-tail Gestoría Online cluster")
print("=" * 60)

payload_b4 = [{
    "keywords": ["gestoría online autónomos", "asesoría fiscal online", "gestoría fiscal online"],
    "location_code": 2724,
    "language_code": "es",
    "limit": 100,
    "include_serp_info": True
}]

result_b4 = api_post("dataforseo_labs/keyword_ideas/live", payload_b4)
kws_b4 = []
if result_b4 and result_b4.get('tasks'):
    for task in result_b4['tasks']:
        items = task.get('result', [])
        if items:
            kws_b4 = items[0].get('items', [])
            print(f"  Found {len(kws_b4)} keyword ideas")
            for kw in kws_b4[:10]:
                ki = kw.get('keyword_info', {})
                print(f"  - {kw.get('keyword', 'N/A')}: vol={ki.get('search_volume', 0)}, cpc=${ki.get('cpc', 0) or 0:.2f}")
else:
    print("  No results for B4")

with open(RESEARCH_DIR / "phase_b4_gestoria.json", 'w') as f:
    json.dump({"cost": total_cost - 0.405, "count": len(kws_b4), "results": kws_b4[:100]}, f, ensure_ascii=False, indent=2)

if not check_budget("After B4"):
    exit(0)

time.sleep(1)

# ============================================================
# PHASE C1: SERP Analysis for top 10 keywords
# ============================================================
print("\n" + "=" * 60)
print("PHASE C1: SERP Analysis - Top 10 keywords")
print("=" * 60)

top_keywords = [
    "modelo 130", "cuota autónomos", "iva autónomos", "modelo 131",
    "tarifa plana autónomos", "gastos deducibles autónomos"
]

# SERP API - analyze top keywords
payload_serp = [{"keyword": kw, "location_code": 2724, "language_code": "es"} for kw in top_keywords]

result_serp = api_post("serp/google/organic/live/advanced", payload_serp)
serp_results = []
if result_serp and result_serp.get('tasks'):
    for i, task in enumerate(result_serp['tasks']):
        items = task.get('result', [])
        if items:
            first = items[0]
            organic = first.get('organic', []) if isinstance(first, dict) else []
            serp_results.append({
                'keyword': top_keywords[i] if i < len(top_keywords) else f'kw_{i}',
                'total_results': first.get('total_results', 0) if isinstance(first, dict) else 0,
                'top_5_domains': [{'domain': o.get('domain', ''), 'position': o.get('position', 0)} for o in organic[:5]],
                'features': [o.get('type', '') for o in organic[:10]],
            })
            print(f"  {top_keywords[i]}: {len(organic)} organic results, top={organic[0].get('domain', 'N/A') if organic else 'N/A'}")
    print(f"  Analyzed {len(serp_results)} keywords")
else:
    print("  SERP analysis failed")

with open(RESEARCH_DIR / "phase_c1_serp_analysis.json", 'w') as f:
    json.dump({"cost": total_cost - 0.405, "results": serp_results}, f, ensure_ascii=False, indent=2)

if not check_budget("After C1"):
    exit(0)

time.sleep(1)

# ============================================================
# PHASE C2: Domain Overview for competitors
# ============================================================
print("\n" + "=" * 60)
print("PHASE C2: Competitor Domain Analysis")
print("=" * 60)

competitors = ["taxdown.es", "autonomos.info"]

payload_domains = [{"target": domain, "location_code": 2724, "language_code": "es"} for domain in competitors]

result_domains = api_post("dataforseo_labs/domain_rank_overview/live", payload_domains)
domain_data = []
if result_domains and result_domains.get('tasks'):
    for i, task in enumerate(result_domains['tasks']):
        items = task.get('result', [])
        if items:
            first = items[0] if isinstance(items[0], dict) else {}
            domain_data.append({
                'domain': competitors[i] if i < len(competitors) else f'domain_{i}',
                'organic_traffic': first.get('organic_traffic', 0),
                'organic_keywords': first.get('organic_count', 0),
                'paid_traffic': first.get('paid_traffic', 0),
            })
            print(f"  {competitors[i]}: organic_traffic={first.get('organic_traffic', 0)}, keywords={first.get('organic_count', 0)}")
    print(f"  Analyzed {len(domain_data)} competitor domains")
else:
    print("  Domain analysis failed")

with open(RESEARCH_DIR / "phase_c2_competitor_domains.json", 'w') as f:
    json.dump({"cost": total_cost - 0.405, "results": domain_data}, f, ensure_ascii=False, indent=2)

# ============================================================
# FINAL BUDGET CHECK
# ============================================================
print("\n" + "=" * 60)
print("BUDGET CHECKPOINT — $1.00 LIMIT")
print("=" * 60)
print(f"Total cost: ${total_cost:.3f}")
print(f"Budget remaining to $1.00: ${max(0, BUDGET_LIMIT - total_cost):.3f}")
print(f"Phases completed: B1, B2, B3, B4, C1, C2")
print(f"Files saved in: {RESEARCH_DIR}")
print(f"\nAll files:")
for f in sorted(RESEARCH_DIR.glob("phase_*.json")):
    print(f"  {f.name}: {f.stat().st_size:,} bytes")
