
import plotly.graph_objects as go

# Data
categories = ["Autonomy Level", "Decision Making", "Adaptability", "Learning Capability", "Scope of Actions", "Human Intervention"]
traditional_automation = [35, 25, 20, 15, 40, 85]
agentic_ai = [85, 90, 88, 92, 87, 25]

# Create horizontal grouped bar chart
fig = go.Figure()

# Add Traditional Automation bars
fig.add_trace(go.Bar(
    y=categories,
    x=traditional_automation,
    name='Traditional Auto',
    orientation='h',
    marker_color='#5D878F',
    text=traditional_automation,
    textposition='auto',
))

# Add Agentic AI bars
fig.add_trace(go.Bar(
    y=categories,
    x=agentic_ai,
    name='Agentic AI',
    orientation='h',
    marker_color='#2E8B57',
    text=agentic_ai,
    textposition='auto',
))

# Update layout
fig.update_layout(
    title='Traditional Automation vs Agentic AI',
    xaxis_title='Score (0-100)',
    yaxis_title='',
    barmode='group',
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.05,
        xanchor='center',
        x=0.5
    )
)

# Update x-axis
fig.update_xaxes(range=[0, 100])

# Update traces
fig.update_traces(cliponaxis=False)

# Save as PNG and SVG
fig.write_image('chart.png')
fig.write_image('chart.svg', format='svg')
