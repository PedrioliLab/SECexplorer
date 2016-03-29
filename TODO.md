TODO
====

1. Complex feature candidates:
  - Columns to have:
    - Index nr
    - # Subunits 
    - From fraction (left sec)
    - To fraction (right sec)
    - Cluster score (intra-group correlation)
    - Subunits (Separated list of Uniprot IDs)
    - Intensity-based stoichiometry (colon-separated, e.g. 1:2:3, must have same order as subunits column)
    - Estimated MW (SUM(Intensity-based stoichiometry * MW\_subunits))
    - Apparent MW (convertSECtoMW(Right\_SEC - Left\_SEC))
    - Delta von App, Est
  - Rows have to be orderable on all columns 
  - convertSECtoMW:
    - log10(MW), dann linreg zu SEC position 
2. On hover over complex feature rows:
  - Fade all protein traces to gray
  - Highlight traces of subunits with red or similar
  - Gray box between left sec and right sec 
  - Vline for estimated MW
3. Trace plot:
  - Vary line type as well
  - Zweite Achse on top fuer convertSECtoMW(SEC)
4. SEC friends:
  - Find for a given protein other proteins that correlate well 
    - either globally
    - or within the complex feature boundaries
  - Button "Find similar proteins" auf complex feature row
    - Results in list sorted by correlation score
    - Hover over each subunit plots the full trace into the trace window and
      adjusts the molecular weight vline.
    - Button "Add" on each additional subunit candidate. Pressing it adds the
      protein to the complex feature. Process can be repeated... 
5. Additional Id inputs:
  - Gene name
  - Evtl. uniprot name

