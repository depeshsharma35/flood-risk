import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Database, Zap } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Home() {
  const [, navigate] = useLocation();

  const stats = [
    { label: '100,000+', value: 'Data Points', icon: Database, color: 'text-blue-600' },
    { label: '28', value: 'States Covered', icon: TrendingUp, color: 'text-cyan-600' },
    { label: '3', value: 'ML Models', icon: Zap, color: 'text-teal-600' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Flood Risk Intelligence
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Advanced machine learning and explainable AI for predicting and analyzing flood risk across India
            </p>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-sm">
          <h2 className="section-header">The Challenge</h2>
          <div className="space-y-4">
            <p className="text-foreground leading-relaxed">
              India faces unprecedented flood risks due to climate change, deforestation, and rapid urbanization. Traditional prediction methods lack real-time accuracy and explainability. Our system combines advanced machine learning with interpretable AI to provide actionable flood risk predictions at the state and district levels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-semibold text-accent mb-1">Climate Impact</p>
                <p className="text-sm text-muted-foreground">Increasing rainfall variability and extreme weather events</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-semibold text-accent mb-1">Environmental Degradation</p>
                <p className="text-sm text-muted-foreground">Forest loss and land cover changes amplify flood severity</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-semibold text-accent mb-1">Prediction Gap</p>
                <p className="text-sm text-muted-foreground">Lack of real-time, interpretable risk assessment tools</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="space-y-4">
          <h2 className="section-header">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="stat-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-foreground">{stat.label}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="h-1 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full w-1/3"></div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-sm">
          <h2 className="section-header">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Machine Learning Models</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span><strong>Random Forest:</strong> Feature importance and risk classification</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span><strong>XGBoost:</strong> Gradient boosting for high-accuracy predictions</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span><strong>SARIMAX:</strong> Time-series forecasting for temporal patterns</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Data Integration</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span><strong>IndoFloods:</strong> Historical flood event database</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span><strong>Rainfall Data:</strong> IMD meteorological records</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span><strong>Environmental Data:</strong> Tree loss and land cover analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* System Architecture */}
        <section className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-sm">
          <h2 className="section-header">System Architecture</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-6">
              Our system follows a data-driven pipeline from ingestion to explainable predictions:
            </p>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center p-4 bg-secondary rounded-lg border border-border">
                <p className="font-semibold text-foreground">Data Ingestion</p>
                <p className="text-xs text-muted-foreground mt-1">Flood, rainfall, environmental sources</p>
              </div>
              <div className="hidden md:block text-2xl text-accent">→</div>
              <div className="flex-1 text-center p-4 bg-secondary rounded-lg border border-border">
                <p className="font-semibold text-foreground">Feature Engineering</p>
                <p className="text-xs text-muted-foreground mt-1">Lag variables, aggregations, normalization</p>
              </div>
              <div className="hidden md:block text-2xl text-accent">→</div>
              <div className="flex-1 text-center p-4 bg-secondary rounded-lg border border-border">
                <p className="font-semibold text-foreground">ML Models</p>
                <p className="text-xs text-muted-foreground mt-1">Random Forest, XGBoost, SARIMAX</p>
              </div>
              <div className="hidden md:block text-2xl text-accent">→</div>
              <div className="flex-1 text-center p-4 bg-secondary rounded-lg border border-border">
                <p className="font-semibold text-foreground">SHAP Explainability</p>
                <p className="text-xs text-muted-foreground mt-1">Feature contribution analysis</p>
              </div>
              <div className="hidden md:block text-2xl text-accent">→</div>
              <div className="flex-1 text-center p-4 bg-secondary rounded-lg border border-border">
                <p className="font-semibold text-foreground">Dashboard</p>
                <p className="text-xs text-muted-foreground mt-1">Interactive predictions & insights</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="space-y-4">
          <h2 className="section-header">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              onClick={() => navigate('/prediction')}
              className="h-16 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground border-0 shadow-sm hover:shadow-md transition-all duration-200"
            >
              Launch Prediction Model
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('/analytics')}
              variant="outline"
              className="h-16 text-base font-semibold border border-border hover:bg-secondary transition-all duration-200"
            >
              Explore Risk Analytics
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        {/* Footer Info */}
        <section className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            Built with React, Tailwind CSS, and machine learning for disaster risk management
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
