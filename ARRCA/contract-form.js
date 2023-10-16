// Fetch Task from Task
cur_frm.add_fetch('item', 'unit', 'uom');
cur_frm.add_fetch('item', 'quantity', 'quantity');
cur_frm.add_fetch('item', 'productivity', 'activity_unit_rate');
cur_frm.add_fetch('item', 'direct_cost_after_conversion', 'total_cost');
