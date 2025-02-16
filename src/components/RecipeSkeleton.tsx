// RecipeSkeleton.tsx
import React from "react";
import styles from "./RecipeSkeleton.module.css";

const RecipeSkeleton: React.FC = () => {
  return (
    <div className={styles.recipeSkeleton}>
      {/* Title */}
      <div className={`${styles.skeletonTitle} ${styles.pulse}`} />

      {/* Cooking time and servings */}
      <div className={styles.skeletonMeta}>
        <div className={`${styles.skeletonMetaItem} ${styles.pulse}`} />
        <div className={`${styles.skeletonMetaItem} ${styles.pulse}`} />
      </div>

      {/* Ingredients section */}
      <div className={styles.skeletonSection}>
        <div className={`${styles.skeletonSubtitle} ${styles.pulse}`} />
        <div className={styles.skeletonList}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`ingredient-${index}`}
              className={`${styles.skeletonListItem} ${styles.pulse}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeSkeleton;
