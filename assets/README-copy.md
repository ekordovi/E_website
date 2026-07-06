# practicing my technical skills on CD19xCD3 BiTE's functionality after droplet microfluidics screening.

  ### Which design features - VH/VL orientation, scFv's, linker type - survived functional screening

This project analyzes raw supplementary data from a high-throughput droplet microfluidics screen for functional CD19xCD3 bispecific T-cell engager antibodies. The goal is to compare the starting BiTE library composition with the design features enriched among functional hits after screening. 

#### The Analysis focuses on
  - scFV orientation
  - linker type
  - binder choice
 
 #### Key Findings
 ## Key Findings

The functional screen strongly enriched BiTEs with the `CD19VL-VH-CD3VH-VL` orientation. This orientation increased from **43.58%** of the starting library to **81.82%** of functional hits, representing a **1.88x enrichment**. The opposite CD3 orientation classes, `CD19VH-VL-CD3VL-VH` and `CD19VL-VH-CD3VL-VH`, were not recovered among functional hits.

Among CD3 binders, `L2K` and `TRX4` were the clearest enriched features. `L2K` rose from **18.19%** to **34.34%** (**1.89x enrichment**), while `TRX4` rose from **16.64%** to **31.31%** (**1.88x enrichment**). In contrast, `h38E4.v1` was strongly depleted, falling from **34.32%** to **6.06%** (**0.18x enrichment**).

Among CD19 binders, `B43` showed the strongest enrichment, increasing from **18.69%** to **26.25%** (**1.40x enrichment**). `4G7` was mildly enriched from **31.47%** to **35.35%** (**1.12x enrichment**), while `JUNO241` was approximately maintained from **29.23%** to **30.30%** (**1.04x enrichment**). `FMC63` was depleted from **20.61%** to **8.08%** (**0.39x enrichment**).

Linker effects were more modest. `GGGGSGGS` increased from **18.65%** to **22.22%** (**1.19x enrichment**), and `AEAAAKAEAAAKA` increased from **26.98%** to **31.31%** (**1.16x enrichment**). `AEAAAKA` and `GGGGS` were depleted relative to their starting-library representation.

#### Interpretation

Overall, the screen suggests that BiTE functionality was most sensitive to **scFv orientation** and **binder identity**, especially CD3 binder choice. The strongest functional-hit pattern was enrichment for the `CD19VL-VH-CD3VH-VL` orientation combined with `L2K` or `TRX4` CD3 binders. Linker effects were present but less dramatic, suggesting linker choice may fine-tune functionality rather than dominate it.

## Figures

#### Orientation Enrichment

![Orientation Enrichment](Visuals/Orientation-starting_v_functional.pngOrientation-starting_v_functional.png)

### CD3 Binder enrichment

![CD3 Binder enrichment](Visuals/CD3_scFv-starting_v_functional.pngCD3_scFv-starting_v_functional.png)

### CD19 binder enrichment

![CD19 Binder enrichment](Visuals/CD19_scFV-starting_v_functional.pngCD19_scFV-starting_v_functional.png)

### Linker enrichment

![linker enrichment](Visuals//linker-starting_v_functional.pnglinker-starting_v_functional.png)