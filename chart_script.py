
import plotly.graph_objects as go
import math

# Create a professional flowchart
fig = go.Figure()

# Define positions for the nodes in a circular arrangement
# Perceive (top), Analyze (right), Decide (bottom), Act (left), Learn (center)
radius = 4.5
center_x = 0
center_y = 0

positions = {
    'Perceive': (0, 4.5),      # top
    'Analyze': (5, 0),          # right  
    'Decide': (0, -4.5),        # bottom
    'Act': (-5, 0),             # left
    'Learn': (0, 0)             # center
}

# Define node details with all sub-items
nodes = {
    'Perceive': {
        'title': 'PERCEIVE/MONITOR',
        'items': ['Collect real-time data', 'Monitor production metrics', 'Track resource utilization'],
        'color': '#1FB8CD'
    },
    'Analyze': {
        'title': 'ANALYZE',
        'items': ['Detect anomalies', 'Identify bottlenecks', 'Pattern recognition', 'Root cause analysis'],
        'color': '#2E8B57'
    },
    'Decide': {
        'title': 'DECIDE',
        'items': ['Evaluate options', 'Assess impact', 'Prioritize actions', 'Select optimal solution'],
        'color': '#1FB8CD'
    },
    'Act': {
        'title': 'ACT',
        'items': ['Assign tasks', 'Reallocate resources', 'Trigger workflows', 'Execute actions'],
        'color': '#2E8B57'
    },
    'Learn': {
        'title': 'LEARN',
        'items': ['Measure outcomes', 'Update models', 'Improve decisions'],
        'color': '#5D878F'
    }
}

# Draw circular flow arrows (main cycle)
arrow_color = '#333333'
connections = [
    ('Perceive', 'Analyze'),
    ('Analyze', 'Decide'),
    ('Decide', 'Act'),
    ('Act', 'Perceive')
]

for from_node, to_node in connections:
    x0, y0 = positions[from_node]
    x1, y1 = positions[to_node]
    
    # Calculate control point for curved arrow
    mid_x = (x0 + x1) / 2
    mid_y = (y0 + y1) / 2
    
    # Push control point outward for circular flow
    dist_from_center = math.sqrt(mid_x**2 + mid_y**2)
    if dist_from_center > 0:
        factor = 1.3
        mid_x = mid_x * factor
        mid_y = mid_y * factor
    
    # Create curved path
    t = [0, 0.5, 1]
    curve_x = []
    curve_y = []
    for ti in t:
        px = (1-ti)**2 * x0 + 2*(1-ti)*ti * mid_x + ti**2 * x1
        py = (1-ti)**2 * y0 + 2*(1-ti)*ti * mid_y + ti**2 * y1
        curve_x.append(px)
        curve_y.append(py)
    
    fig.add_trace(go.Scatter(
        x=curve_x,
        y=curve_y,
        mode='lines',
        line=dict(color=arrow_color, width=4),
        showlegend=False,
        hoverinfo='skip'
    ))
    
    # Add arrowhead at the end
    dx = curve_x[2] - curve_x[1]
    dy = curve_y[2] - curve_y[1]
    arrow_angle = math.atan2(dy, dx)
    arrow_len = 0.4
    
    fig.add_annotation(
        x=x1, y=y1,
        ax=x1 - arrow_len * math.cos(arrow_angle),
        ay=y1 - arrow_len * math.sin(arrow_angle),
        xref='x', yref='y',
        axref='x', ayref='y',
        showarrow=True,
        arrowhead=2,
        arrowsize=2,
        arrowwidth=4,
        arrowcolor=arrow_color
    )

# Draw dashed lines from outer nodes to center (Learn)
dash_color = '#888888'
for node in ['Perceive', 'Analyze', 'Decide', 'Act']:
    x0, y0 = positions[node]
    x1, y1 = positions['Learn']
    
    fig.add_trace(go.Scatter(
        x=[x0, x1],
        y=[y0, y1],
        mode='lines',
        line=dict(color=dash_color, width=3, dash='dot'),
        showlegend=False,
        hoverinfo='skip'
    ))

# Draw rectangular nodes with text
box_width = 2.2
box_height_map = {
    'Perceive': 1.4,
    'Analyze': 1.6,
    'Decide': 1.6,
    'Act': 1.4,
    'Learn': 1.2
}

for node_name, node_data in nodes.items():
    x, y = positions[node_name]
    bw = box_width
    bh = box_height_map[node_name]
    
    # Draw rectangle background
    fig.add_shape(
        type="rect",
        x0=x - bw/2, y0=y - bh/2,
        x1=x + bw/2, y1=y + bh/2,
        fillcolor=node_data['color'],
        line=dict(color='white', width=3),
        layer='below'
    )
    
    # Add title and items text
    items_text = '<br>'.join(['• ' + item for item in node_data['items']])
    full_text = f"<b>{node_data['title']}</b><br>{items_text}"
    
    fig.add_annotation(
        x=x, y=y,
        text=full_text,
        showarrow=False,
        font=dict(size=10, color='white', family='Arial'),
        align='left',
        xanchor='center',
        yanchor='middle'
    )

# Update layout
fig.update_layout(
    title='Agentic AI Decision Loop',
    showlegend=False,
    xaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-7, 7]
    ),
    yaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-7, 7],
        scaleanchor='x',
        scaleratio=1
    ),
    plot_bgcolor='white',
    paper_bgcolor='white'
)

# Save the figure
fig.write_image('agentic_ai_loop.png')
fig.write_image('agentic_ai_loop.svg', format='svg')

print("Agentic AI Decision Loop chart created successfully!")
