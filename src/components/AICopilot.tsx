"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { StartupInputs, TwinOutputs, ScenarioType } from "@/lib/engine";

interface AICopilotProps {
  inputs: StartupInputs;
  outputs: TwinOutputs;
  scenario: ScenarioType;
}

function getUIMessageText(
  msg: { parts?: Array<{ type: string; text?: string }> }
): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return "";
  return msg.parts
    .filter(
      (p): p is { type: "text"; text: string } => p.type === "text"
    )
    .map((p) => p.text)
    .join("");
}

const QUICK_PROMPTS = [
  "Can we afford to hire 2 more engineers?",
  "Why is our risk score high?",
  "Should we raise equity or take a loan?",
  "What happens under worst case?",
  "How do we extend runway by 3 months?",
  "Is our burn rate sustainable?",
];

export default function AICopilot({
  inputs,
  outputs,
  scenario,
}: AICopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Build the dashboard state context for the LLM
  const dashboardState = useMemo(
    () => ({
      scenario_mode: scenario,
      inputs: {
        baseline_cash: inputs.baseline_cash,
        baseline_revenue: inputs.baseline_revenue,
        baseline_fixed_expenses: inputs.baseline_fixed_expenses,
        baseline_growth_rate: `${(inputs.baseline_growth_rate * 100).toFixed(1)}%`,
        gross_margin: `${(inputs.gross_margin * 100).toFixed(1)}%`,
        total_team_size: inputs.total_team_size,
        avg_cost_per_hire: inputs.avg_cost_per_hire,
        employees_hired: inputs.employees_hired,
        marketing_spend: inputs.marketing_spend,
        pricing_change_percent: `${inputs.pricing_change_percent}%`,
        cost_cut_percent: `${inputs.cost_cut_percent}%`,
        revenue_shock_percent: `${inputs.revenue_shock_percent}%`,
        market_index: inputs.market_index,
        equity_raised: inputs.equity_raised,
        loan_taken: inputs.loan_taken,
        interest_rate: `${(inputs.interest_rate * 100).toFixed(1)}%`,
      },
      outputs: {
        total_team_size: outputs.total_team_size,
        total_new_salary_expense: outputs.total_new_salary_expense,
        revenue_per_employee: Math.round(outputs.revenue_per_employee),
        adjusted_revenue: Math.round(outputs.adjusted_revenue),
        adjusted_fixed_expenses: Math.round(outputs.adjusted_fixed_expenses),
        burn_rate: Math.round(outputs.burn_rate),
        current_cash_available: outputs.current_cash_available,
        runway_months: Math.round(outputs.runway_months * 10) / 10,
        is_break_even_achieved: outputs.is_break_even_achieved,
        break_even_month: outputs.break_even_month,
        bankruptcy_month: outputs.bankruptcy_month,
        risk_score: outputs.risk_score,
        survival_probability: outputs.survival_probability,
        collapse_within_12_months: outputs.collapse_within_12_months,
        cash_ratio: Math.round(outputs.cash_ratio * 100) / 100,
        debt_to_cash_ratio:
          Math.round(outputs.debt_to_cash_ratio * 100) / 100,
        burn_sensitivity_index:
          Math.round(outputs.burn_sensitivity_index * 100) / 100,
        growth_volatility_index:
          Math.round(outputs.growth_volatility_index * 100) / 100,
        market_dependency_index:
          Math.round(outputs.market_dependency_index * 100) / 100,
        cash_trajectory_12m: outputs.cash_trajectory,
        revenue_trajectory_12m: outputs.revenue_trajectory,
        marketing_spend: outputs.marketing_spend,
        loan_interest_payment_monthly: Math.round(
          outputs.loan_interest_payment_monthly
        ),
      },
    }),
    [inputs, outputs, scenario]
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai-analysis",
        prepareSendMessagesRequest: ({ id, messages }) => ({
          body: { messages, id, dashboardState },
        }),
      }),
    [dashboardState]
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });

  const isLoading = status === "streaming" || status === "submitted";

  // No GSAP for open/close -- CSS transitions handle it reliably with React state

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // No GSAP on the toggle -- avoids conflicts with React mount/unmount

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text });
    setInputValue("");
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Toggle Button -- always rendered, hidden via CSS when panel is open */}
      <button
        ref={toggleRef}
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all duration-300 hover:text-accent hover:border-accent/30 ${
          isOpen ? "pointer-events-none opacity-0 scale-75" : "opacity-100 scale-100"
        }`}
        aria-label="Open AI Copilot"
        tabIndex={isOpen ? -1 : 0}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 2C5.58 2 2 5.08 2 8.88C2 11.21 3.38 13.27 5.5 14.41L4.5 18L8.29 15.69C8.85 15.78 9.42 15.82 10 15.82C14.42 15.82 18 12.74 18 8.94C18 5.08 14.42 2 10 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="9" r="1" fill="currentColor" />
          <circle cx="10" cy="9" r="1" fill="currentColor" />
          <circle cx="13" cy="9" r="1" fill="currentColor" />
        </svg>
      </button>

      {/* Sidebar Panel */}
      <div
        ref={panelRef}
        className={`fixed right-0 top-0 z-40 flex h-full w-full flex-col border-l border-border bg-card sm:w-[420px] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="text-accent"
              >
                <path
                  d="M7 1L1 13H13L7 1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="7" cy="9" r="1" fill="currentColor" />
                <line
                  x1="7"
                  y1="5"
                  x2="7"
                  y2="7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Financial Copilot
              </h2>
              <p className="text-[10px] text-muted-foreground">
                Powered by your live twin state
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Clear chat history"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:bg-critical/10 hover:text-critical hover:border-critical/30"
              aria-label="Close copilot"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 3L11 11M11 3L3 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Live context badge */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 bg-muted/40">
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-medium text-muted-foreground">
            Live context: {scenario.toUpperCase()} scenario | Runway:{" "}
            {outputs.runway_months >= 999
              ? "Profitable"
              : `${Math.round(outputs.runway_months)}mo`}{" "}
            | Risk: {outputs.risk_score}/100
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-medium text-foreground mb-2">
                  Ask me anything about your startup twin:
                </p>
                <ul className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                  <li>- Hiring decisions & team cost impact</li>
                  <li>- Burn rate analysis & optimization</li>
                  <li>- Fundraising strategy (equity vs debt)</li>
                  <li>- Scenario comparison & risk assessment</li>
                  <li>- Break-even timeline & cash runway</li>
                </ul>
              </div>

              {/* Quick prompts */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Quick Questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="rounded-md border border-border bg-muted/50 px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-accent/30 hover:text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => {
                const text = getUIMessageText(message);
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        isUser
                          ? "bg-accent/15 text-foreground border border-accent/20"
                          : "bg-muted text-card-foreground border border-border"
                      }`}
                    >
                      {!isUser && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="h-1 w-1 rounded-full bg-accent" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-accent">
                            Copilot
                          </span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{text}</div>
                    </div>
                  </div>
                );
              })}

              {/* Loading indicator */}
              {isLoading && !messages.some(m => m.role === "assistant" && getUIMessageText(m).length > 0 && m === messages[messages.length - 1]) && (
                <div className="flex justify-start">
                  <div className="rounded-xl bg-muted border border-border px-3.5 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="h-1 w-1 rounded-full bg-accent" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-accent">
                        Analyzing
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:0ms]" />
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:150ms]" />
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your startup twin..."
              disabled={isLoading}
              className="flex-1 rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7H13M13 7L7 1M13 7L7 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
          <p className="mt-1.5 text-center text-[9px] text-muted-foreground">
            Analysis based on live twin state only -- not financial advice
          </p>
        </div>
      </div>

      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
