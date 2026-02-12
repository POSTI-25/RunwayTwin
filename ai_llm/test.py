import pandas as pd
import numpy as np

# Load existing dataset
df = pd.read_csv("startup_synthetic_dataset_10k.csv")

# Assumptions
AVG_ANNUAL_SALARY = 60000
MONTHLY_SALARY = AVG_ANNUAL_SALARY / 12

# -------------------------------
# Derived Calculations
# -------------------------------

# Total team size
df["total_team_size"] = df["baseline_team_size"] + df["employees_hired"]

# Total new salary expense (monthly)
df["total_new_salary_expense"] = df["employees_hired"] * MONTHLY_SALARY

# Revenue per employee
df["revenue_per_employee"] = df["baseline_revenue"] / df["total_team_size"].replace(0, 1)

# Adjusted revenue
df["adjusted_revenue"] = (
    df["baseline_revenue"]
    * (1 + df["baseline_growth_rate"])
    * (1 + df["pricing_change_percent"])
    * (1 + df["revenue_shock_percent"])
    * df["market_index"]
)

# Adjusted fixed expenses
df["adjusted_fixed_expenses"] = (
    df["baseline_fixed_expenses"] * (1 - df["cost_cut_percent"])
    + df["total_new_salary_expense"]
)

# Burn rate
df["burn_rate"] = df["adjusted_fixed_expenses"] - df["adjusted_revenue"]

# Current cash available
df["current_cash_available"] = (
    df["baseline_cash"]
    + df["equity_raised"]
    + df["loan_taken"]
)

# Runway months
df["runway_months"] = np.where(
    df["burn_rate"] > 0,
    df["current_cash_available"] / df["burn_rate"],
    60
)

# Break-even month estimate
df["break_even_month_estimate"] = np.where(
    df["adjusted_revenue"] > df["adjusted_fixed_expenses"],
    0,
    np.where(
        df["baseline_growth_rate"] > 0,
        (df["adjusted_fixed_expenses"] - df["adjusted_revenue"]) /
        (df["adjusted_revenue"] * df["baseline_growth_rate"].replace(0, 0.01)),
        np.nan
    )
)

# Months to break-even
df["months_to_break_even"] = df["break_even_month_estimate"]

# Break-even achieved flag
df["is_break_even_achieved_flag"] = np.where(
    df["adjusted_revenue"] >= df["adjusted_fixed_expenses"],
    1,
    0
)

# Cash ratio
df["cash_ratio"] = df["current_cash_available"] / df["adjusted_fixed_expenses"].replace(0, 1)

# Debt to cash ratio
df["debt_to_cash_ratio"] = df["loan_taken"] / df["current_cash_available"].replace(0, 1)

# Burn sensitivity index
df["burn_sensitivity_index"] = df["burn_rate"] / df["adjusted_revenue"].replace(0, 1)

# Growth volatility index
df["growth_volatility_index"] = abs(df["revenue_shock_percent"])

# Market dependency index
df["market_dependency_index"] = abs(df["market_index"] - 1)

# Risk score
df["risk_score"] = (
    0.35 * df["burn_sensitivity_index"]
    + 0.30 * df["debt_to_cash_ratio"]
    + 0.20 * df["growth_volatility_index"]
    + 0.15 * df["market_dependency_index"]
)

# Normalize risk score
df["risk_score"] = (df["risk_score"] - df["risk_score"].min()) / (
    df["risk_score"].max() - df["risk_score"].min()
)

# Survival probability
df["survival_probability"] = 1 / (1 + np.exp(5 * (df["risk_score"] - 0.5)))

# Collapse within 12 months flag
df["collapse_within_12_months_flag"] = np.where(
    df["runway_months"] < 12,
    1,
    0
)

# Bankruptcy month
df["bankruptcy_month"] = np.where(
    df["burn_rate"] > 0,
    df["runway_months"],
    np.nan
)

# Save final dataset
df.to_csv("startup_complete_dataset_10k.csv", index=False)

print("Complete dataset generated: startup_complete_dataset_10k.csv")