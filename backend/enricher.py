# [v1.0-scaffold] Core architectural signatures and baseline handlers
import re
from typing import Dict, Any, List, Optional

# Top LeetCode & Industry SQL Database with Companies, Patterns, and Links
LEETCODE_SQL_CATALOG = {
    # High-Frequency Hard / Advanced
    "department top three salaries": {
        "leetcode_id": 185,
        "leetcode_title": "Department Top Three Salaries",
        "leetcode_url": "https://leetcode.com/problems/department-top-three-salaries/",
        "companies": ["Amazon", "Google", "Meta", "Apple", "Bloomberg"],
        "pattern": "Window Functions (DENSE_RANK)",
        "difficulty": "hard",
        "frequency": "96%"
    },
    "trips and users": {
        "leetcode_id": 262,
        "leetcode_title": "Trips and Users",
        "leetcode_url": "https://leetcode.com/problems/trips-and-users/",
        "companies": ["Uber", "Lyft", "Meta", "DoorDash"],
        "pattern": "Conditional Aggregation & Subquery Filtering",
        "difficulty": "hard",
        "frequency": "92%"
    },
    "human traffic of stadium": {
        "leetcode_id": 601,
        "leetcode_title": "Human Traffic of Stadium",
        "leetcode_url": "https://leetcode.com/problems/human-traffic-of-stadium/",
        "companies": ["Amazon", "Meta", "Bloomberg"],
        "pattern": "Gaps and Islands (Window Framing)",
        "difficulty": "hard",
        "frequency": "89%"
    },
    "median employee salary": {
        "leetcode_id": 569,
        "leetcode_title": "Median Employee Salary",
        "leetcode_url": "https://leetcode.com/problems/median-employee-salary/",
        "companies": ["Google", "Meta", "Amazon"],
        "pattern": "Percentile & Row Number Windowing",
        "difficulty": "hard",
        "frequency": "87%"
    },
    "find cumulative salary of an employee": {
        "leetcode_id": 579,
        "leetcode_title": "Find Cumulative Salary of an Employee",
        "leetcode_url": "https://leetcode.com/problems/find-cumulative-salary-of-an-employee/",
        "companies": ["Amazon", "Bloomberg", "Google"],
        "pattern": "Rolling Window Aggregation (ROWS BETWEEN)",
        "difficulty": "hard",
        "frequency": "85%"
    },
    "active users": {
        "leetcode_id": 1454,
        "leetcode_title": "Active Users",
        "leetcode_url": "https://leetcode.com/problems/active-users/",
        "companies": ["Meta", "Adobe", "Twitter"],
        "pattern": "Consecutive Dates / Gaps & Islands",
        "difficulty": "medium",
        "frequency": "91%"
    },

    # High-Frequency Medium
    "rank scores": {
        "leetcode_id": 178,
        "leetcode_title": "Rank Scores",
        "leetcode_url": "https://leetcode.com/problems/rank-scores/",
        "companies": ["Amazon", "Adobe", "Bloomberg"],
        "pattern": "Ranking (DENSE_RANK vs COUNT DISTINCT)",
        "difficulty": "medium",
        "frequency": "95%"
    },
    "consecutive numbers": {
        "leetcode_id": 180,
        "leetcode_title": "Consecutive Numbers",
        "leetcode_url": "https://leetcode.com/problems/consecutive-numbers/",
        "companies": ["Amazon", "Meta", "Adobe"],
        "pattern": "LEAD and LAG Window Functions",
        "difficulty": "medium",
        "frequency": "94%"
    },
    "nth highest salary": {
        "leetcode_id": 177,
        "leetcode_title": "Nth Highest Salary",
        "leetcode_url": "https://leetcode.com/problems/nth-highest-salary/",
        "companies": ["Amazon", "Meta", "Google", "Apple"],
        "pattern": "DENSE_RANK & Offset Filtering",
        "difficulty": "medium",
        "frequency": "98%"
    },
    "second highest salary": {
        "leetcode_id": 176,
        "leetcode_title": "Second Highest Salary",
        "leetcode_url": "https://leetcode.com/problems/second-highest-salary/",
        "companies": ["Amazon", "Apple", "Google", "Microsoft"],
        "pattern": "Subqueries & LIMIT/OFFSET handling NULLs",
        "difficulty": "easy",
        "frequency": "99%"
    },
    "managers with at least 5 direct reports": {
        "leetcode_id": 570,
        "leetcode_title": "Managers with at Least 5 Direct Reports",
        "leetcode_url": "https://leetcode.com/problems/managers-with-at-least-5-direct-reports/",
        "companies": ["Amazon", "Meta", "Apple"],
        "pattern": "Self Joins & GROUP BY HAVING",
        "difficulty": "medium",
        "frequency": "93%"
    },
    "consecutive available seats": {
        "leetcode_id": 603,
        "leetcode_title": "Consecutive Available Seats",
        "leetcode_url": "https://leetcode.com/problems/consecutive-available-seats/",
        "companies": ["Amazon", "Google"],
        "pattern": "Self-Joins & LAG/LEAD",
        "difficulty": "easy",
        "frequency": "88%"
    },
    "game play analysis iv": {
        "leetcode_id": 550,
        "leetcode_title": "Game Play Analysis IV",
        "leetcode_url": "https://leetcode.com/problems/game-play-analysis-iv/",
        "companies": ["Meta", "Amazon", "Activision Blizzard"],
        "pattern": "Cohort Retention & Date Truncation",
        "difficulty": "medium",
        "frequency": "96%"
    },
    "monthly transactions i": {
        "leetcode_id": 1193,
        "leetcode_title": "Monthly Transactions I",
        "leetcode_url": "https://leetcode.com/problems/monthly-transactions-i/",
        "companies": ["Stripe", "Amazon", "Square"],
        "pattern": "Conditional Aggregation (SUM CASE)",
        "difficulty": "medium",
        "frequency": "90%"
    },
    "immediate food delivery ii": {
        "leetcode_id": 1174,
        "leetcode_title": "Immediate Food Delivery II",
        "leetcode_url": "https://leetcode.com/problems/immediate-food-delivery-ii/",
        "companies": ["DoorDash", "Uber", "Instacart"],
        "pattern": "First-Order Partitioning via Window Functions",
        "difficulty": "medium",
        "frequency": "92%"
    },
    "reformat department table": {
        "leetcode_id": 1179,
        "leetcode_title": "Reformat Department Table",
        "leetcode_url": "https://leetcode.com/problems/reformat-department-table/",
        "companies": ["Amazon", "Bloomberg", "Microsoft"],
        "pattern": "Pivot Tables & Dynamic Columns",
        "difficulty": "easy",
        "frequency": "88%"
    },
    "customer placing largest number of orders": {
        "leetcode_id": 586,
        "leetcode_title": "Customer Placing the Largest Number of Orders",
        "leetcode_url": "https://leetcode.com/problems/customer-placing-the-largest-number-of-orders/",
        "companies": ["Amazon", "Apple", "Twitter"],
        "pattern": "GROUP BY with ORDER BY and LIMIT",
        "difficulty": "easy",
        "frequency": "90%"
    },
    "rising temperature": {
        "leetcode_id": 197,
        "leetcode_title": "Rising Temperature",
        "leetcode_url": "https://leetcode.com/problems/rising-temperature/",
        "companies": ["Amazon", "Apple", "Adobe"],
        "pattern": "Self-Join on Date Intervals (DATEDIFF / INTERVAL)",
        "difficulty": "easy",
        "frequency": "93%"
    },
    "exchange seats": {
        "leetcode_id": 626,
        "leetcode_title": "Exchange Seats",
        "leetcode_url": "https://leetcode.com/problems/exchange-seats/",
        "companies": ["Amazon", "Bloomberg", "Google"],
        "pattern": "CASE Logic & Bitwise Parity Matching",
        "difficulty": "medium",
        "frequency": "91%"
    },
    "tree node": {
        "leetcode_id": 608,
        "leetcode_title": "Tree Node",
        "leetcode_url": "https://leetcode.com/problems/tree-node/",
        "companies": ["Amazon", "Uber", "Twitter"],
