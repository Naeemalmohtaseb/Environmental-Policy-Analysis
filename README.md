# Environmental Justice Gap Analysis

## Identifying Communities With High Environmental Burden and Low Political Representation

This project analyzes where environmental risk and political underrepresentation overlap across U.S. counties. It combines EPA EJSCREEN environmental indicators, CDC Social Vulnerability Index data, congressional district shapefiles, and League of Conservation Voters scorecard data to identify communities that face high environmental burdens while receiving comparatively low environmental policy support from elected representatives.

The result is a county-level prioritization framework for environmental justice outreach, advocacy, and policy intervention. The analysis produces ranked county lists, state-level summaries, demographic disparity metrics, publication-ready visualizations, and an interactive dashboard prototype.

![Environmental Justice Overview](environmental_justice_comprehensive_analysis.png)

## Project Highlights

- Analyzed environmental and demographic indicators across 86,000+ census tracts and aggregated them to county-level insights.
- Built a Justice Gap Index that compares environmental burden against political environmental advocacy.
- Integrated EPA, CDC, LCV, Census, and congressional district data into one analytical workflow.
- Identified priority counties where high environmental burden overlaps with low LCV representation scores.
- Produced executive-ready outputs, including summary metrics, state priority rankings, county intervention lists, and visual reports.
- Created static and interactive visualizations for both technical exploration and stakeholder communication.

## Why This Project Matters

Environmental justice issues are often discussed in terms of pollution exposure, race, income, or geography. This project adds another layer: representation. Communities with the greatest environmental exposure may not have elected officials who prioritize environmental protection, leaving these communities with fewer policy pathways for relief.

By quantifying that mismatch, this analysis helps answer practical questions:

- Which counties should be prioritized for environmental justice intervention?
- Where are environmental burdens highest relative to political advocacy?
- How do justice gaps vary by state, party representation, and demographic group?
- Which communities are most exposed to both environmental and institutional vulnerability?

## Core Features

### Justice Gap Index

The project introduces a normalized Justice Gap Index that compares environmental burden with political representation:

```text
Justice Gap Index = Environmental Burden Z-score - LCV Score Z-score
```

Positive values indicate counties where environmental burden is high relative to environmental policy representation. Larger positive values suggest greater need for advocacy, organizing, or policy intervention.

### Population-Weighted Environmental Burden

Environmental burden is calculated using tract-level population weights before county aggregation. This prevents sparsely populated tracts from distorting county scores and better reflects the number of people affected by environmental hazards.

### Multi-Source Data Integration

The notebook brings together:

- EPA EJSCREEN 2024 tract-level environmental and demographic indicators
- CDC Social Vulnerability Index 2022 county-level vulnerability metrics
- LCV congressional scorecard data for environmental voting behavior
- Census TIGER/Line congressional district shapefiles
- County and state-level geographic identifiers

### Priority County Rankings

The analysis generates ranked outputs for:

- Highest environmental burden
- Largest justice gaps
- Lowest environmental representation
- Priority counties for intervention
- State-level policy and advocacy focus

### Demographic Disparity Analysis

The project evaluates whether environmental burden is distributed evenly across demographic groups. It compares high-burden exposure rates for people of color and low-income populations against broader population baselines.

### Visual Reporting

The repo includes several generated visual reports designed for presentations, portfolio review, and stakeholder communication:

- `environmental_justice_comprehensive_analysis.png`
- `environmental_justice_final_dashboard.png`
- `justice_gap_party_demographic_analysis.png`
- `environmental_justice_gap_analysis.png`
- `environmental_justice_comprehensive_report.png`

## Key Findings

### Environmental Burden and Representation Are Unevenly Distributed

The analysis finds that many high-burden counties are represented by officials with lower environmental voting scores. These counties represent strategic opportunities for environmental justice advocacy, targeted organizing, and policy support.

### Party Representation Shows a Clear Pattern

County-level justice gaps differ substantially by dominant party representation. Republican-represented counties show higher average justice gaps than Democratic-represented counties, suggesting that environmental burden and environmental policy support are not evenly aligned across political geographies.

### Demographic Vulnerability Compounds Environmental Risk

Communities of color and low-income populations are more likely to live in high-burden areas. The analysis connects these disparities to political representation, showing where environmental and institutional vulnerabilities overlap.

### Priority States Emerge for Intervention

The state-level rankings highlight areas where justice gaps are concentrated. These outputs can support campaign planning, grant targeting, legislative strategy, or nonprofit advocacy.

## Repository Contents

| File | Description |
| --- | --- |
| `LVC_DA.ipynb` | Main analysis notebook containing data loading, cleaning, modeling, ranking, and visualization code. |
| `LCV_priority_counties_intervention.csv` | Top priority counties for environmental justice intervention. |
| `LCV_state_priorities.csv` | State-level priority rankings. |
| `ranking_environmental_burden.csv` | Counties ranked by environmental burden. |
| `ranking_justice_gap.csv` | Counties ranked by justice gap. |
| `ranking_low_representation.csv` | Counties ranked by low environmental representation. |
| `project_summary_metrics.csv` | High-level summary metrics from the analysis. |
| `priority_state_recommendations.csv` | State-level action recommendations. |
| `tableau_county_analysis.csv` | County-level dataset prepared for Tableau or BI tools. |
| `tableau_priority_counties.csv` | Priority county dataset prepared for dashboarding. |
| `tableau_state_summary.csv` | State-level summary dataset for visualization. |

## Technical Skills Demonstrated

- Data cleaning and transformation with Python, Pandas, and NumPy
- Population-weighted aggregation from tract to county level
- Multi-source data integration across federal, nonprofit, and geospatial datasets
- Geospatial processing with GeoPandas and Census shapefiles
- Statistical modeling with scikit-learn and statsmodels
- Index design using normalization and composite scoring
- Dashboard prototyping with Plotly Dash
- Static data visualization with Matplotlib and Seaborn
- Export workflows for CSV, Tableau, and presentation-ready graphics

## Methodology

### 1. Data Preparation

The workflow loads raw environmental, social vulnerability, congressional scorecard, and shapefile data. It standardizes identifiers such as county FIPS codes and state names so the datasets can be merged reliably.

### 2. Environmental Burden Scoring

EJSCREEN indicators are grouped into environmental and demographic burden components. These are combined into a composite score and aggregated from census tract to county level using population weights.

### 3. Representation Scoring

LCV scorecard data is cleaned and aggregated to estimate environmental policy support by state and congressional representation. Lower LCV scores indicate weaker environmental voting records.

### 4. Justice Gap Calculation

Environmental burden and LCV scores are standardized using Z-scores. The Justice Gap Index is calculated by subtracting representation strength from environmental burden. This highlights counties where environmental risk is high but environmental advocacy is low.

### 5. Ranking and Segmentation

Counties are ranked by environmental burden, representation, and justice gap. The analysis also groups results by state, party, and demographic indicators to identify broader patterns.

### 6. Visualization and Export

The final workflow produces CSV deliverables, static reports, and dashboard-ready datasets that can be used in policy briefs, portfolio presentations, or interactive BI tools.

## Installation and Usage

### Requirements

This project was built in Python and uses common data science and geospatial libraries:

```bash
pip install pandas numpy matplotlib seaborn scikit-learn statsmodels plotly dash geopandas shapely folium openpyxl
```

### Run the Analysis

Open the notebook:

```bash
jupyter notebook LVC_DA.ipynb
```

Run the notebook cells from top to bottom to regenerate the ranked CSV files and visual outputs.

### Data Notes

Large source datasets are included locally in this working project. If publishing to GitHub, consider excluding large raw files and documenting download links instead, especially for EJSCREEN CSV files and geospatial data.

## Example Outputs

### State and County Ranking Files

The analysis exports ranked CSV files that can be used directly for further analysis, reporting, or dashboard development.

```text
ranking_justice_gap.csv
ranking_environmental_burden.csv
ranking_low_representation.csv
LCV_priority_counties_intervention.csv
LCV_state_priorities.csv
```

### Dashboard-Ready Data

The Tableau exports provide cleaner reporting tables for interactive dashboards:

```text
tableau_county_analysis.csv
tableau_priority_counties.csv
tableau_state_summary.csv
```

## Potential Use Cases

- Environmental justice advocacy planning
- Nonprofit campaign targeting
- Public policy prioritization
- Grant funding allocation
- Legislative accountability tracking
- Community risk communication
- Portfolio demonstration for data analyst, policy analyst, and data science roles

## Future Improvements

- Add a dedicated `requirements.txt` for reproducible setup.
- Move dashboard code into a standalone `dashboard.py` app.
- Add county-to-district spatial joins for more precise representative matching.
- Incorporate time-series LCV scores to track changes in representation over time.
- Add health outcomes data such as asthma, cancer risk, or hospitalization rates.
- Build a public-facing dashboard with filters for state, party, demographic group, and burden type.
- Add automated validation checks for FIPS matching and missing values.

## Project Value

This project demonstrates the ability to turn complex public datasets into an actionable analytical product. It combines technical data engineering, statistical reasoning, domain knowledge, and stakeholder-focused communication. The final outputs are designed not only to answer a research question, but to support real-world decision-making around environmental justice and political accountability.

## Acknowledgments

Data sources include EPA EJSCREEN, CDC Social Vulnerability Index, League of Conservation Voters scorecard data, and U.S. Census Bureau TIGER/Line shapefiles.
